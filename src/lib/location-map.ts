/**
 * エリアグループ名 → { 都道府県, 徒歩圏内（目安 10〜15 分）の駅一覧 } の辞書。
 *
 * エリア別ページの「都道府県 → 駅」ナビと、近接駅を考慮したエリア検索で使う。
 * 同じグループの駅は、検索でどちらの駅名を入力してもお互いの記事がヒットする（双方向）。
 *
 * 辞書に無い location が記事で使われた場合は、自身の location名だけの単独グループ・
 * prefecture: 'その他' にフォールバックする（ビルドが失敗しないようにするため）。
 * 後日ここに駅を追記すれば、次のビルドから反映される。
 */
export interface AreaGroup {
	prefecture: string;
	/** このグループに属する駅・エリア名（徒歩圏内の目安）。1 つ目が代表駅である必要はない */
	stations: string[];
}

export const AREA_GROUPS: Record<string, AreaGroup> = {
	'秋葉原・神田エリア': {
		prefecture: '東京都',
		stations: ['秋葉原', '末広町', '神田', '岩本町', '淡路町', '小川町'],
	},
	神保町エリア: {
		prefecture: '東京都',
		stations: ['神保町', '水道橋', '御茶ノ水', '九段下'],
	},
	'新宿・代々木エリア': {
		prefecture: '東京都',
		stations: ['新宿', '新宿三丁目', '新宿西口', '西武新宿', '代々木', '南新宿'],
	},
	池袋エリア: {
		prefecture: '東京都',
		stations: ['池袋', '東池袋'],
	},
	高田馬場エリア: {
		prefecture: '東京都',
		stations: ['高田馬場', '早稲田', '西早稲田'],
	},
	渋谷エリア: {
		prefecture: '東京都',
		stations: ['渋谷', '神泉', '代官山'],
	},
	'上野・御徒町エリア': {
		prefecture: '東京都',
		stations: ['上野', '御徒町', '上野広小路', '仲御徒町', '京成上野'],
	},
	新橋エリア: {
		prefecture: '東京都',
		stations: ['新橋', '内幸町', '汐留', '御成門'],
	},
	'東京・大手町エリア': {
		prefecture: '東京都',
		stations: ['東京', '大手町', '日本橋'],
	},
	銀座エリア: {
		prefecture: '東京都',
		stations: ['銀座', '銀座一丁目', '有楽町', '新富町'],
	},
	中野エリア: {
		prefecture: '東京都',
		stations: ['中野', '新中野'],
	},
	高円寺エリア: {
		prefecture: '東京都',
		stations: ['高円寺', '新高円寺'],
	},
	荻窪エリア: {
		prefecture: '東京都',
		stations: ['荻窪', '南阿佐ヶ谷'],
	},
	蒲田エリア: {
		prefecture: '東京都',
		stations: ['蒲田', '京急蒲田'],
	},
	つくばみらいエリア: {
		prefecture: '茨城県',
		stations: ['つくばみらい'],
	},
};

export interface LocationInfo {
	prefecture: string;
	group: string;
}

// 駅名 → { グループ名, 都道府県 } の逆引き（起動時に一度だけ構築）
const LOCATION_INDEX = new Map<string, LocationInfo>();
for (const [group, { prefecture, stations }] of Object.entries(AREA_GROUPS)) {
	for (const station of stations) {
		LOCATION_INDEX.set(station, { group, prefecture });
	}
}

/** location から都道府県・近接駅グループ名を引く。未登録なら自身の location名だけの単独グループとして扱う */
export function getLocationInfo(location: string): LocationInfo {
	return LOCATION_INDEX.get(location) ?? { prefecture: 'その他', group: location };
}

/** location と同じグループ（徒歩圏内）に属する駅名の一覧（自身を含む）。未登録なら自身のみの配列 */
export function getGroupStations(location: string): string[] {
	const info = LOCATION_INDEX.get(location);
	return info ? AREA_GROUPS[info.group].stations : [location];
}
