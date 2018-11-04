FROM node:8.12 as builder

RUN mkdir /src
WORKDIR /src

ADD package.json ./
ADD yarn.lock ./

RUN yarn install

ADD src ./src
ADD public ./public

RUN yarn build

FROM ipfs/go-ipfs

ENV IPFS_PATH=/tmp_serve/

COPY --from=builder /src/build /build
RUN ipfs init

ENTRYPOINT []
CMD ipfs add --progress=false -r -n /build
