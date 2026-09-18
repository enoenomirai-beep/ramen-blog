/**
 * location（フロントマターの駅名・エリア名）→ 都道府県・近接駅グループの辞書。
 *
 * エリア別ページの「都道府県 → 駅」ナビと、近接駅を考慮したエリア検索で使う。
 * group は徒歩圏内など近接する駅をまとめるためのキー（同じ group なら検索でまとめてヒットする）。
 *
 * 辞書に無い location が記事で使われた場合は、prefecture: 'その他' / group: 自身の location名
 * にフォールバックする（ビルドが失敗しないようにするため）。後日ここに追記すれば反映される。
 */
export interface LocationInfo {
	prefecture: string;
	group: string;
}

const LOCATION_MAP: Record<string, LocationInfo> = {
	秋葉原: { prefecture: '東京都', group: '秋葉原エリア' },
	末広町: { prefecture: '東京都', group: '秋葉原エリア' },
	神保町: { prefecture: '東京都', group: '神保町エリア' },
	つくばみらい: { prefecture: '茨城県', group: 'つくばみらいエリア' },
};

/** location から都道府県・近接駅グループを引く。未登録なら自身の location名だけの単独グループとして扱う */
export function getLocationInfo(location: string): LocationInfo {
	return LOCATION_MAP[location] ?? { prefecture: 'その他', group: location };
}
