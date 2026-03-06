/**
 * 布局配置 - 可在此调整卡片、面板等组件的尺寸和间距
 * Layout config - adjust card/panel dimensions and gaps here
 *
 * 修改后保存即可生效，无需改其他文件。
 */

/** 技能卡片 / 动态内容卡片高度（如「为你精选」、发现页的卡片）单位：px。建议 ≥ 380 否则标题/描述会被裁切 */
export const CARD_HEIGHT = 380;

/** 右侧活动/社区卡片高度（Dashboard 和 Explore 页的侧边栏）单位：px */
export const SIDEBAR_CARD_HEIGHT = 430;

/** 「为你精选」区块与上方卡片（我的学习/已收藏）的间距，单位：px。调小可缩小空隙 */
export const GAP_ABOVE_TOP_PICKS = 8;

/** 「专业会员」卡片与上方活动卡片的间距，单位：px。调小可缩小空隙 */
export const GAP_ABOVE_PRO_MEMBER = 8;

/** 成就墙每个徽章卡片的最小高度，单位：px。调大则卡片底部下移，调小则更紧凑 */
export const ACHIEVEMENT_BADGE_CARD_HEIGHT = 210;
