FROM golang:1.14-alpine3.12

RUN apk update && \
    apk add --no-cache git && \
    apk add --no-cache make

COPY . /go/src/github.com/shortintern2020-C-cryptograph/TeamF/server/
ENV GO111MODULE=on

WORKDIR /go/src/github.com/shortintern2020-C-cryptograph/TeamF/server/

#RUN go get github.com/pilu/fresh

RUN go mod tidy

CMD ["go", "run", "main.go"]