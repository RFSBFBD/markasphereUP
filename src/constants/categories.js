// Portfolio category labels are UI presentation data, not CMS content.
// The dashboard stores `projects.category` as a plain string id; this map
// provides the localized labels used by PortfolioCard and PremiumCaseStudy.
export const CATEGORY_LABELS = {
  'all': { label: 'جميع الأعمال', labelEn: 'All Projects' },
  'visual-identity': { label: 'الهويات البصرية', labelEn: 'Visual Identity' },
  'company-profiles': { label: 'بروفايلات الشركات', labelEn: 'Company Profiles' },
  'websites': { label: 'المواقع الإلكترونية', labelEn: 'Websites' },
  'social-media': { label: 'السوشيال ميديا', labelEn: 'Social Media' },
  'video': { label: 'الفيديو والمونتاج', labelEn: 'Video Editing' },
  'marketing': { label: 'الحملات التسويقية', labelEn: 'Marketing Campaigns' },
  'print': { label: 'المطبوعات التجارية', labelEn: 'Print Design' },
  'brand-strategy': { label: 'استراتيجية العلامة', labelEn: 'Brand Strategy' },
  'digital-marketing': { label: 'التسويق الرقمي', labelEn: 'Digital Marketing' },
  'web-development': { label: 'تطوير الويب', labelEn: 'Web Development' },
  'content-creation': { label: 'إنشاء المحتوى', labelEn: 'Content Creation' },
  'ui-ux-design': { label: 'تصميم واجهات', labelEn: 'UI/UX Design' }
}

export const PORTFOLIO_FILTERS = [
  'all',
  'visual-identity',
  'company-profiles',
  'websites',
  'social-media',
  'video',
  'marketing',
  'print'
]

export function getCategoryLabel(categoryId, locale = 'ar') {
  if (!categoryId || categoryId === 'all') {
    const all = CATEGORY_LABELS.all
    return locale === 'ar' ? all.label : all.labelEn
  }
  const cat = CATEGORY_LABELS[categoryId]
  if (!cat) return categoryId
  return locale === 'ar' ? cat.label : cat.labelEn
}

export default CATEGORY_LABELS
