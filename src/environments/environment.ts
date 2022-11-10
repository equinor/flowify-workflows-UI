export const environment = {
  baseUri: process.env.NODE_ENV === 'development' ? '/' : '/flowify-server/',
  bearerToken:
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYW5kYm94IiwiYXVkIjoiZmxvd2lmeSIsImlhdCI6MTY2MzY3NDU0NywibmJmIjoxNjYzNjc0NTQ3LCJleHAiOjI2MTA0NDU3NDcsIm9pZCI6IjgwNDgiLCJuYW1lIjoiRi4gTG93ZSIsImVtYWlsIjoiZmxvd0BzYW5kLmJveCIsInJvbGVzIjpbInNhbmRib3gtZGV2ZWxvcGVyIl19.Hc4gXrL6hsE91S6qlJpFfsONq7L-jTN9WsHxtC1fhGk',
};

// dev api uri: https://flowify.dev.aurora.equinor.com/flowify-server/
