/**
 * 記事をまたいで使う店舗の基本情報（店舗詳細モーダル用）。
 *
 * キーは記事の id（スラッグ）。`orderedMenu` は記事本文の「注文したもの」に書かれている
 * 実際に注文した品と価格をそのまま集約したもので、お店の全メニューではない
 * （全メニューの価格や営業時間・定休日はユーザーが確認していない情報なので、
 * ウェブ検索などで推測して埋めることはしていない。分かったら追記する）。
 */
export interface ShopMenuItem {
	name: string;
	price: number;
}

export interface ShopInfo {
	shopName: string;
	/** 分かっている場合のみ設定する（未確認の情報は載せない） */
	businessHours?: string;
	/** 分かっている場合のみ設定する（未確認の情報は載せない） */
	regularHoliday?: string;
	/** 訪問時に実際に注文した品（記事本文の「注文したもの」から集約） */
	orderedMenu?: ShopMenuItem[];
}

export const SHOPS: Record<string, ShopInfo> = {
	'iekei-tokyo-suehirocho': {
		shopName: 'iekei Tokyo 王道家',
		orderedMenu: [
			{ name: 'チャーシュー麺（チャーシュー3枚・油多め）', price: 1100 },
			{ name: 'ライス（普通）', price: 150 },
		],
	},
	'bushoya-gaiden-akihabara': {
		shopName: '武将家外伝',
		orderedMenu: [
			{ name: '外伝ラーメン（麺かため・油多め）', price: 1250 },
			{ name: 'ライス食べ放題', price: 100 },
		],
	},
	'jiro-mejirodai': {
		shopName: 'ラーメン二郎 めじろ台店',
		orderedMenu: [
			{ name: '小ラーメン（アブラ少なめ）', price: 900 },
			{ name: '生卵', price: 50 },
		],
	},
	'ramen-gaku': {
		shopName: '王道家直系 ラーメンがく',
		orderedMenu: [
			{ name: 'チャーシュー麺（チャーシュー3枚・油多め）', price: 1200 },
			{ name: 'ほうれん草', price: 100 },
			{ name: 'ライス（普通）', price: 200 },
		],
	},
	'nonakaya-kanda': {
		shopName: '十八代目野中家',
		orderedMenu: [
			{ name: '学生ラーメン（全部普通）', price: 800 },
			{ name: 'キャベツ', price: 100 },
			{ name: 'ライス（食べ放題）', price: 100 },
		],
	},
	'kidouya-suidobashi': {
		shopName: '輝道家 水道橋',
		orderedMenu: [
			{ name: '学生ラーメン（油多め）', price: 900 },
			{ name: '高級海苔5枚', price: 150 },
			{ name: 'チャーシュー1枚追加', price: 100 },
		],
	},
	'kidouya-suidobashi-umakara': {
		shopName: '輝道家 水道橋',
		orderedMenu: [
			{ name: '旨辛ラーメン（全部普通）', price: 1200 },
			{ name: '高級海苔5枚', price: 150 },
		],
	},
};

/** 記事の id（スラッグ）から店舗情報を取得する。無ければ undefined */
export function getShopInfo(postId: string): ShopInfo | undefined {
	return SHOPS[postId];
}
