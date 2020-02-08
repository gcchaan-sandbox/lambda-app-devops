// 将来的に import type を使う
// eslint-disable-next-line import/no-unresolved
import { Context, ScheduledEvent } from 'aws-lambda';
import dayjs from 'dayjs';
import { settings } from 'settings'

export function printDate() {
  return dayjs().startOf('month').add(1, 'day').set('year', 2020).set('month', 0).format('YYYY-MM-DD HH:mm:ss')
}

export async function awesomeBatch(
    event: ScheduledEvent,
    context: Context,
    _: never): Promise<void> {
  console.log('hello ' + settings.service);
  console.log(printDate());
  return;
};
