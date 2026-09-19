/**
 * エリアグループ名 → { 都道府県, 徒歩圏内（目安 10〜15 分）の駅一覧 } の辞書。
 *
 * エリア別ページの「都道府県 → 駅」ナビと、近接駅を考慮したエリア検索で使う。
 * 同じグループの駅は、検索でどちらの駅名を入力してもお互いの記事がヒットする（双方向）。
 * 各駅には利用できる鉄道路線（`lines`）も持たせており、路線名でも検索できる
 * （例: 「山手線」で検索すると、山手線が通るすべての駅の記事がヒットする）。
 *
 * 辞書に無い location が記事で使われた場合は、自身の location名だけの単独グループ・
 * prefecture: 'その他' にフォールバックする（ビルドが失敗しないようにするため）。
 * 後日ここに駅を追記すれば、次のビルドから反映される。
 */
export interface Station {
	name: string;
	/** この駅を通る鉄道路線名 */
	lines: string[];
}

export interface AreaGroup {
	prefecture: string;
	/** このグループに属する駅・エリア（徒歩圏内の目安）。1 つ目が代表駅である必要はない */
	stations: Station[];
	/** グループの代表地点（駅の目安の緯度経度。個々の店舗の正確な位置ではない） */
	lat: number;
	lng: number;
}

export const AREA_GROUPS: Record<string, AreaGroup> = {
	'秋葉原・神田エリア': {
		prefecture: '東京都',
		stations: [
			{ name: '秋葉原', lines: ['JR山手線', 'JR京浜東北線', 'JR中央・総武線', 'つくばエクスプレス', '日比谷線'] },
			{ name: '末広町', lines: ['銀座線'] },
			{ name: '神田', lines: ['JR山手線', 'JR京浜東北線', 'JR中央線', '銀座線'] },
			{ name: '岩本町', lines: ['都営新宿線'] },
			{ name: '淡路町', lines: ['丸ノ内線'] },
			{ name: '小川町', lines: ['都営新宿線'] },
		],
		lat: 35.6984,
		lng: 139.7731,
	},
	神保町エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '神保町', lines: ['半蔵門線', '都営三田線', '都営新宿線'] },
			{ name: '水道橋', lines: ['JR中央・総武線', '都営三田線'] },
			{ name: '御茶ノ水', lines: ['JR中央線', '丸ノ内線'] },
			{ name: '九段下', lines: ['東西線', '半蔵門線', '都営新宿線'] },
		],
		lat: 35.6961,
		lng: 139.7565,
	},
	'新宿・代々木エリア': {
		prefecture: '東京都',
		stations: [
			{
				name: '新宿',
				lines: ['JR山手線', 'JR中央線', 'JR埼京線', '小田急線', '京王線', '都営新宿線', '丸ノ内線', '都営大江戸線'],
			},
			{ name: '新宿三丁目', lines: ['丸ノ内線', '副都心線', '都営新宿線'] },
			{ name: '新宿西口', lines: ['都営大江戸線'] },
			{ name: '西武新宿', lines: ['西武新宿線'] },
			{ name: '代々木', lines: ['JR山手線', 'JR中央・総武線', '都営大江戸線'] },
			{ name: '南新宿', lines: ['小田急線'] },
		],
		lat: 35.6896,
		lng: 139.7006,
	},
	池袋エリア: {
		prefecture: '東京都',
		stations: [
			{
				name: '池袋',
				lines: ['JR山手線', 'JR埼京線', '丸ノ内線', '有楽町線', '副都心線', '東武東上線', '西武池袋線'],
			},
			{ name: '東池袋', lines: ['有楽町線'] },
		],
		lat: 35.7295,
		lng: 139.7109,
	},
	高田馬場エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '高田馬場', lines: ['JR山手線', '西武新宿線', '東西線'] },
			{ name: '早稲田', lines: ['東西線'] },
			{ name: '西早稲田', lines: ['副都心線'] },
		],
		lat: 35.7128,
		lng: 139.7038,
	},
	渋谷エリア: {
		prefecture: '東京都',
		stations: [
			{
				name: '渋谷',
				lines: ['JR山手線', 'JR埼京線', '副都心線', '半蔵門線', '銀座線', '田園都市線', '京王井の頭線', '東急東横線'],
			},
			{ name: '神泉', lines: ['京王井の頭線'] },
			{ name: '代官山', lines: ['東急東横線'] },
		],
		lat: 35.658,
		lng: 139.7016,
	},
	'上野・御徒町エリア': {
		prefecture: '東京都',
		stations: [
			{ name: '上野', lines: ['JR山手線', 'JR京浜東北線', 'JR常磐線', '日比谷線', '銀座線'] },
			{ name: '御徒町', lines: ['JR山手線', 'JR京浜東北線'] },
			{ name: '上野広小路', lines: ['銀座線'] },
			{ name: '仲御徒町', lines: ['都営大江戸線'] },
			{ name: '京成上野', lines: ['京成本線'] },
		],
		lat: 35.7141,
		lng: 139.7774,
	},
	新橋エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '新橋', lines: ['JR山手線', 'JR京浜東北線', '銀座線', '都営浅草線', '都営三田線', 'ゆりかもめ'] },
			{ name: '内幸町', lines: ['都営三田線'] },
			{ name: '汐留', lines: ['都営大江戸線', 'ゆりかもめ'] },
			{ name: '御成門', lines: ['都営三田線'] },
		],
		lat: 35.6665,
		lng: 139.758,
	},
	'東京・大手町エリア': {
		prefecture: '東京都',
		stations: [
			{ name: '東京', lines: ['JR山手線', 'JR京浜東北線', 'JR中央線', '丸ノ内線'] },
			{ name: '大手町', lines: ['丸ノ内線', '東西線', '千代田線', '半蔵門線', '都営三田線'] },
			{ name: '日本橋', lines: ['東西線', '銀座線', '都営浅草線'] },
		],
		lat: 35.6812,
		lng: 139.7671,
	},
	銀座エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '銀座', lines: ['銀座線', '丸ノ内線', '日比谷線'] },
			{ name: '銀座一丁目', lines: ['有楽町線'] },
			{ name: '有楽町', lines: ['JR山手線', 'JR京浜東北線', '有楽町線', '都営三田線'] },
			{ name: '新富町', lines: ['有楽町線'] },
		],
		lat: 35.6716,
		lng: 139.765,
	},
	中野エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '中野', lines: ['JR中央線', '東西線'] },
			{ name: '新中野', lines: ['丸ノ内線'] },
		],
		lat: 35.7056,
		lng: 139.6658,
	},
	高円寺エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '高円寺', lines: ['JR中央線'] },
			{ name: '新高円寺', lines: ['丸ノ内線'] },
		],
		lat: 35.7057,
		lng: 139.6497,
	},
	荻窪エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '荻窪', lines: ['JR中央線', '丸ノ内線'] },
			{ name: '南阿佐ヶ谷', lines: ['丸ノ内線'] },
		],
		lat: 35.7042,
		lng: 139.6202,
	},
	蒲田エリア: {
		prefecture: '東京都',
		stations: [
			{ name: '蒲田', lines: ['JR京浜東北線', '東急池上線', '東急多摩川線'] },
			{ name: '京急蒲田', lines: ['京急本線', '京急空港線'] },
		],
		lat: 35.5622,
		lng: 139.7161,
	},
	つくばみらいエリア: {
		prefecture: '茨城県',
		stations: [{ name: 'つくばみらい', lines: ['つくばエクスプレス'] }],
		lat: 35.9427,
		lng: 139.9713,
	},
};

export interface LocationInfo {
	prefecture: string;
	group: string;
}

// 駅名 → { グループ名, 都道府県, 路線一覧 } の逆引き（起動時に一度だけ構築）
const LOCATION_INDEX = new Map<string, LocationInfo & { lines: string[] }>();
for (const [group, { prefecture, stations }] of Object.entries(AREA_GROUPS)) {
	for (const station of stations) {
		LOCATION_INDEX.set(station.name, { group, prefecture, lines: station.lines });
	}
}

/** location から都道府県・近接駅グループ名を引く。未登録なら自身の location名だけの単独グループとして扱う */
export function getLocationInfo(location: string): LocationInfo {
	return LOCATION_INDEX.get(location) ?? { prefecture: 'その他', group: location };
}

/** location と同じグループ（徒歩圏内）に属する駅名の一覧（自身を含む）。未登録なら自身のみの配列 */
export function getGroupStations(location: string): string[] {
	const info = LOCATION_INDEX.get(location);
	return info ? AREA_GROUPS[info.group].stations.map((station) => station.name) : [location];
}

/** location が属するグループの代表座標（駅の目安）。辞書に無い location は undefined */
export function getCoordinates(location: string): { lat: number; lng: number } | undefined {
	const info = LOCATION_INDEX.get(location);
	if (!info) return undefined;
	const { lat, lng } = AREA_GROUPS[info.group];
	return { lat, lng };
}

/** location（駅）を通る鉄道路線名の一覧。未登録なら空配列 */
export function getLines(location: string): string[] {
	return LOCATION_INDEX.get(location)?.lines ?? [];
}
