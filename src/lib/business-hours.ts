/**
 * 営業時間の曜日別対応。
 *
 * content.config.ts の `business_hours` は単純な文字列（例: "11:00〜21:00"）に加えて、
 * 曜日ごとに異なる営業時間の配列（例: 平日と土日で違う）も受け付ける。
 * 配列の場合、連続した曜日は「月〜金」のようにまとめて表示する。
 */
export const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface BusinessHoursGroup {
	/** この営業時間が当てはまる曜日 */
	days: Weekday[];
	/** 営業時間（例: "11:00〜15:00 / 17:00〜21:00"、"定休日"） */
	hours: string;
}

/** 曜日の配列を「月〜金」のような表記にする。3 日以上の連続でなければ「月・水・金」のように列挙する */
function formatDays(days: Weekday[]): string {
	const sorted = [...days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
	const indices = sorted.map((day) => WEEKDAYS.indexOf(day));
	const isConsecutiveRun = indices.length >= 3 && indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);
	return isConsecutiveRun ? `${sorted[0]}〜${sorted[sorted.length - 1]}` : sorted.join('・');
}

export function formatBusinessHours(businessHours: string | BusinessHoursGroup[]): string {
	if (typeof businessHours === 'string') return businessHours;
	return businessHours.map((group) => `${formatDays(group.days)} ${group.hours}`).join('、');
}
