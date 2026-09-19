/**
 * 系統（style）別の概算カロリー・PFC（タンパク質・脂質・炭水化物）目安と、
 * それを消費するための運動換算（スクワット・ランニング）の目安を出す。
 *
 * あくまで一般的なラーメン1杯のイメージに基づくユーモア目的の概算値であり、
 * 店舗・トッピング・量による実際の値ではない。
 */
export interface StyleNutrition {
	/** 概算カロリー（kcal） */
	kcal: number;
	/** タンパク質（g） */
	protein: number;
	/** 脂質（g） */
	fat: number;
	/** 炭水化物（g） */
	carbs: number;
}

// 系統名は記事の自由入力なので、よく使われる系統名だけ登録し、未登録の系統は DEFAULT_NUTRITION にフォールバックする
export const STYLE_NUTRITION: Record<string, StyleNutrition> = {
	家系: { kcal: 900, protein: 35, fat: 40, carbs: 95 },
	二郎系: { kcal: 1300, protein: 45, fat: 55, carbs: 140 },
	豚骨: { kcal: 750, protein: 30, fat: 32, carbs: 85 },
	味噌: { kcal: 800, protein: 28, fat: 30, carbs: 100 },
	塩: { kcal: 550, protein: 22, fat: 15, carbs: 75 },
	醤油: { kcal: 600, protein: 24, fat: 18, carbs: 80 },
	淡麗系: { kcal: 550, protein: 22, fat: 14, carbs: 75 },
	担々麺: { kcal: 850, protein: 30, fat: 42, carbs: 90 },
	つけ麺: { kcal: 950, protein: 32, fat: 30, carbs: 130 },
};

/** 系統名が辞書に無い場合のフォールバック値（醤油ラーメン程度を想定） */
export const DEFAULT_NUTRITION: StyleNutrition = { kcal: 700, protein: 25, fat: 25, carbs: 85 };

export function getStyleNutrition(style: string): StyleNutrition {
	return STYLE_NUTRITION[style] ?? DEFAULT_NUTRITION;
}

// 運動換算の目安（一般的な体重・強度を想定した概算値）
const SQUAT_KCAL_PER_HOUR = 300;
const RUNNING_KCAL_PER_KM = 70;

/** このカロリーを消費するのに必要なスクワットの時間（目安・時間） */
export function squatHoursFor(kcal: number): number {
	return kcal / SQUAT_KCAL_PER_HOUR;
}

/** このカロリーを消費するのに必要なランニングの距離（目安・km） */
export function runningKmFor(kcal: number): number {
	return kcal / RUNNING_KCAL_PER_KM;
}
