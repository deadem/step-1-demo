FROM node:16-alpine AS builder
# Этот контейнер используется только для сборки приложения

WORKDIR /var/www/app

COPY . .

# RUN npm clean-install
RUN npm install
# При разворачивании prod-версии нужно использовать "clean-install" или "ci", тогда npm установит в точности те зависимости, которые использовались при разработке и указаны в package-lock.json, и не будет потенциальных проблем из-за того, что установилась версия, отличная от той, что была у разработчика.
# Некоторые рекомендуют фиксировать версии пакетов прямо в package.json, но правильный путь - это наличие package-lock.json в репозитории и "clean-install" на проде.
# В данном репозитории отсутствует package-lock, так как это учебный пример и у него не должно быть ограничений по версиям и платформам: например, package-lock от Windows не заработает на Linux, а это тут неприемлемо - разворачиваться должно везде, поэтому жертвуем надёжностью в пользу универсальности и устанавливаем зависимости через простой install

RUN npm run build

FROM node:16-alpine
# А этот контейнер - используется только для запуска. Собранное приложение просто копируем из builder-контейнера

WORKDIR /var/www/app

COPY --from=builder /var/www/app/package*.json ./
COPY --from=builder /var/www/app/dist ./dist
COPY --from=builder /var/www/app/http-rewrite ./http-rewrite
COPY --from=builder /var/www/app/server.js ./

# А вот тут у нас уже гарантированно есть package-lock, поэтому жёстко фиксируем ревизии для сборки через clean-install
RUN npm clean-install --omit=dev

EXPOSE 3000

CMD ["node", "./server.js"]
