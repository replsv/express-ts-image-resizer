# EX-TS Image Resizer

EX ~ express
TS ~ typescript

## Starting

```
docker-compose up
```

... or

```
npm i
npm run-script build-ts # compile using tscompiler
npm start
```

## Files

The project is already provisioned with some high-res photos.
Access them as it follows:

```
localhost:8080/images/sarah-dorweiler-x2Tmfd1-SgA-unsplash.jpg
```

## Resizing and compression

Query params allowed:

- height
- width

```
localhost:8080/images/sarah-dorweiler-x2Tmfd1-SgA-unsplash.jpg?width=500&height=400
```

Based on the device type (mobile / desktop) served by a regex applied on the request's userAgent, the quality can be lower or higher on resized items.

## Stats

GET /stats (Authorization: Basic AUTH_KEY)

```json
{
  "stats": {
    "serve_desktop": 363,
    "serve_mobile": 165,
    "serve_cached": 411,
    "serve_original": 114,
    "serve_404": 0,
    "hits": 184,
    "misses": 308
  },
  "filesStats": {
    "original_files": 13,
    "cached_files_desktop": 134,
    "cached_files_mobile": 123
  }
}
```

(values for usage stats are read/written from/into redis as simple keys)

## ENV vars

```
HTTP_PORT=8080 # listen portn
APP_DIR=/var/www/app/ # app dir
AUTH_KEY=1f87beb8-286f-4dd3-98e6-717463c33134 # auth key for protected routes
REDIS_DSN=redis://redis:6379/0 # redis dsn
FILES_DIR=/var/www/app/data/images/ # local dir for original images
CACHE_DIR=/var/www/app/data/cache/ # caches dir
QUALITY_MOBILE=65 # quality for mobile devices (out of 100)
QUALITY_MOBILE=75 # -~- desktop devices
```

## Tests

```
npm run-script test

> express-image-resizer@0.0.1 test /var/www/app
> jest

 PASS  src/utils/resizer.spec.ts (13.141s)
  ✓ check should cache (6ms)
  ✓ check original file (20ms)
  ✓ check original file format (1ms)
  ✓ check cache path
  ✓ determine device type (3ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        17.42s
Ran all test suites.
```

## Docker

Docker containers:

- app -> the JS app exposed on 8080
- locust -> load test tool exposed on 8089
- redis -> sort-of persistent storage for stats

## Benchmarks

Made available through locust. docker-compose up && navigate to localhost:8089.
Test values inside locust/

## Later improvements

- use an nginx as a reverse proxy for the app -> this nginx instance should check files on storage and serve them if they exist; otherwise, proxy_pass request to the node app
- rewrite in rust :))
