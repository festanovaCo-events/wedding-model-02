const expiredSegment = 'expired';

export const APP_ROUTES = {
  home: '/',
  expired: `/${expiredSegment}`,
} as const;

export const APP_ROUTE_PATHS = {
  expired: expiredSegment,
} as const;

export const INVITATION_PREVIEW_PATH = '/invitations-wedding-model-02';

export const PREVIEW_QUERY_PARAM = 'preview';
export const PREVIEW_QUERY_VALUE = '1';
