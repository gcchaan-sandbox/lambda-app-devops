// 将来的に import type を使う
// eslint-disable-next-line import/no-unresolved
import { Context, ScheduledEvent } from 'aws-lambda';
import dayjs from 'dayjs';
import { settings } from 'settings'

export function printDate() {
  return dayjs().startOf('month').add(1, 'day').set('year', 2020).format('YYYY-MM-DD HH:mm:ss')
}

export async function notify(
    event: ScheduledEvent,
    context: Context,
    _: never): Promise<any> {
  console.log('hello ' + settings.service);
  console.log(printDate());
  return { status: 200, body: '' };
};
