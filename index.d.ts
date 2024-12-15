import { EventEmitter } from "events";
import { ClientRequest, IncomingHttpHeaders, IncomingMessage } from "http";

declare namespace OAuth {
	export interface User {
		id: string;
		username: string;
		global_name: string | null;
		discriminator: string;
		avatar: string | null | undefined;
		mfa_enabled?: boolean;
		banner?: string | null | undefined;
		accent_color?: string | null | undefined;
		locale?: string;
		verified?: boolean;
		email?: string | null | undefined;
		flags?: number;
		premium_type?: number;
		public_flags?: number;
	}

	export interface Member {
		user?: User;
		nick: string | null | undefined;
		roles: string[];
		joined_at: number;
		premium_since?: number | null | undefined;
		deaf: boolean;
		mute: boolean;
		pending?: boolean;
		is_pending?: boolean;
		communication_disabled_until?: string | null;
	}

	// This is not accurate as discord sends a partial object
	export interface Integration {
		id: string;
		name: string;
		type: string;
		enabled: boolean;
		syncing: boolean;
		role_id: string;
		enable_emoticons?: boolean;
		expire_behavior: 0 | 1;
		expire_grace_period: number;
		user?: User;
		account: {
			id: string;
			name: string;
		};
		synced_at: number;
		subscriber_count: number;
		revoked: boolean;
		application?: IntegrationApplication;
	}

	export interface Connection {
		id: string;
		name: string;
		type: string;
		revoked?: string;
		integrations?: Integration[];
		verified: boolean;
		friend_sync: boolean;
		show_activity: boolean;
		visibility: 0 | 1;
	}

	export interface IntegrationApplication {
		id: string;
		name: string;
		icon: string | null | undefined;
		description: string;
		bot?: User;
	}

	export interface PartialApplication {
		id: string;
		name: string;
		icon: string | null | undefined;
		description: string;
		hook?: boolean | null | undefined;
		bot_public: boolean;
		bot_require_code_grant: boolean;
		verify_key: string;
	}

	export interface RoleConnection {
		platform_name: string | null;
		platform_username: string | null;
		metadata: {
			[key: string]: string;
		};
  }

	export interface TokenRequestResult {
		access_token: string;
		token_type: string;
		expires_in: number;
		refresh_token: string;
		scope: string;
		webhook?: Webhook;
		guild?: Guild;
	}

	export interface AuthorizationInformation {
		application: PartialApplication;
		scopes: string[];
		expires: string;
		user?: User;
	}

	export interface PartialGuild {
		id: string;
		name: string;
		icon: string | null;
		owner?: boolean;
		permissions?: string;
		features: string[];
		approximate_member_count?: number;
		approximate_presence_count?: number;
	}

	export interface Webhook {
		type: boolean;
		id: string;
		name: string;
		avatar: string | null;
		channel_id: string;
		guild_id: string;
		application_id: string;
		token: string;
		url: string;
	}

	export interface Guild {
		id: string;
		name: string;
		icon: string | null;
		owner_id: string;
		splash: string | null;
		discovery_splash: string | null;
		afk_channel_id: string | null;
		afk_timeout: number;
		widget_enabled?: boolean;
		widget_channel_id?: string | null;
		verification_level: number;
		default_message_notifications: number;
		explicit_content_filter: number;
		roles: Role[];
		emojis: Emoji[];
		features: string[];
		mfa_level: number;
		application_id: string | null;
		system_channel_id: string | null;
		system_channel_flags: number;
		rules_channel_id: string | null;
		max_presences?: number | null;
		max_members?: number;
		vanity_url_code: string | null;
		description: string | null;
		banner: string | null;
		premium_tier: number;
		premium_subscription_count?: number;
		preferred_locale: string;
		public_updates_channel_id: string | null;
		max_video_channel_users?: number;
		max_stage_video_channel_users?: number;
		nsfw?: boolean | null | undefined;
		nsfw_level: number;
		stickers?: Sticker[];
		premium_progress_bar_enabled: boolean;
		safety_alerts_channel_id: string | null;
	}

	export interface Role {
		id: string;
		name: string;
		color: number;
		hoist: boolean;
		icon?: string | null;
		unicode_emoji?: string | null;
		position: number;
		permissions: string;
		managed: boolean;
		mentionable: boolean;
		flags: number;
		tags?: RoleTags;
	}

	export interface Emoji {
		id: string | null;
		name: string | null;
		roles?: string[];
		user?: User;
		require_colons?: boolean;
		managed?: boolean;
		animated?: boolean;
		available?: boolean;
	}

	export interface Sticker {
		id: string;
		name: string;
		description: string | null;
		tags: string;
		type: number;
		format_type: number;
		available?: boolean;
		guild_id: string;
	}

	export interface RoleTags {
		bot_id?: string;
		integration_id?: string;
		premium_subscriber?: null;
		subscription_listing_id?: string;
		available_for_purchase?: null;
		guild_connections?: null;
	}

	export interface HTTPResponse {
		code: number;
		message: string;
	}

	export class DiscordHTTPError extends Error {
		code: number;
		headers: IncomingHttpHeaders;
		name: "DiscordHTTPError";
		req: ClientRequest;
		res: IncomingMessage;
		response: HTTPResponse;
		constructor(
			req: ClientRequest,
			res: IncomingMessage,
			response: HTTPResponse,
			stack: string,
		);
		flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
	}

	export class DiscordRESTError extends Error {
		code: number;
		headers: IncomingHttpHeaders;
		name: string;
		req: ClientRequest;
		res: IncomingMessage;
		response: HTTPResponse;
		constructor(
			req: ClientRequest,
			res: IncomingMessage,
			response: HTTPResponse,
			stack: string,
		);
		flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
	}
}

declare class OAuth extends EventEmitter {
	constructor(opts?: {
		version?: string;
		clientId?: string;
		redirectUri?: string;
		credentials?: string;
		clientSecret?: string;
		requestTimeout?: number;
		latencyThreshold?: number;
		ratelimiterOffset?: number;
	});
	on(event: "debug" | "warn", listener: (message: string) => void): this;
	tokenRequest(opts: {
		code?: string;
		scope: string[] | string;
		clientId?: string;
		grantType: "authorization_code" | "refresh_token";
		redirectUri?: string;
		refreshToken?: string;
		clientSecret?: string;
	}): Promise<OAuth.TokenRequestResult>;
	revokeToken(access_token: string, credentials?: string): Promise<string>;
	getCurrentAuthorizationInformation(access_token: string): Promise<OAuth.AuthorizationInformation>;
	getUser(access_token: string): Promise<OAuth.User>;
	getUserGuilds(access_token: string, opts?: {
		before?: string;
		after?: string;
		limit?: number;
		withCounts?: boolean;
	}): Promise<OAuth.PartialGuild[]>;
	getUserConnections(access_token: string): Promise<OAuth.Connection[]>;
	getUserRoleConnection(access_token: string, client_id?: string): Promise<OAuth.RoleConnection>;
	updateUserRoleConnection(opts: {
		platformName?: string;
		platformUsername?: string;
		metadata?: {
			[key: string]: string;
		};
		accessToken: string;
		clientId?: string;
	}): Promise<OAuth.RoleConnection>;
	addMember(opts: {
		deaf?: boolean;
		mute?: boolean;
		roles?: string[];
		nickname?: string;
		userId: string;
		guildId: string;
		botToken: string;
		accessToken: string;
	}): Promise<OAuth.Member>;
	getGuildMember(
		access_token: string,
		guildId: string,
	): Promise<OAuth.Member>;
	generateAuthUrl(opts: {
		scope: string[] | string;
		state?: string;
		clientId?: string;
		prompt?: "consent" | "none";
		redirectUri?: string;
		responseType?: "code" | "token";
		permissions?: string;
		integrationType?: 1 | 0;
		guildId?: string;
		disableGuildSelect?: boolean;
	}): string;
}
export = OAuth;
