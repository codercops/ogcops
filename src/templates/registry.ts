import type { TemplateDefinition, TemplateCategory } from './types';

// We'll import all templates here. For now, start with blog templates.
// As categories are added, they get registered here.

const templates = new Map<string, TemplateDefinition>();
const byCategory = new Map<TemplateCategory, TemplateDefinition[]>();

export function registerTemplate(template: TemplateDefinition) {
  templates.set(template.id, template);
  const list = byCategory.get(template.category) || [];
  list.push(template);
  byCategory.set(template.category, list);
}

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.get(id);
}

export function getAllTemplates(): TemplateDefinition[] {
  return Array.from(templates.values());
}

export function getTemplatesByCategory(category: TemplateCategory): TemplateDefinition[] {
  return byCategory.get(category) || [];
}

export function getTemplateCount(): number {
  return templates.size;
}

export function getCategoryCounts(): Record<TemplateCategory, number> {
  const counts = {} as Record<TemplateCategory, number>;
  for (const [cat, list] of byCategory) {
    counts[cat] = list.length;
  }
  return counts;
}

// ──────────────────────────────────────────
// Auto-registration: import all template modules
// ──────────────────────────────────────────

// Blog
import blogMinimalDark from './blog/minimal-dark';
import blogMinimalLight from './blog/minimal-light';
import blogGradientSplit from './blog/gradient-split';
import blogMagazineEditorial from './blog/magazine-editorial';
import blogPhotoOverlay from './blog/photo-overlay';
import blogSidebarAccent from './blog/sidebar-accent';
import blogCodeSnippet from './blog/code-snippet';
import blogNewspaper from './blog/newspaper';
import blogBoldTypography from './blog/bold-typography';
import blogDuotone from './blog/duotone';
import blogGeometric from './blog/geometric';
import blogRetroTerminal from './blog/retro-terminal';

[
  blogMinimalDark,
  blogMinimalLight,
  blogGradientSplit,
  blogMagazineEditorial,
  blogPhotoOverlay,
  blogSidebarAccent,
  blogCodeSnippet,
  blogNewspaper,
  blogBoldTypography,
  blogDuotone,
  blogGeometric,
  blogRetroTerminal,
].forEach(registerTemplate);

// Product
import productCenteredHero from './product/centered-hero';
import productSplitScreen from './product/split-screen';
import productGradientWave from './product/gradient-wave';
import productNeonGlow from './product/neon-glow';
import productGlassmorphism from './product/glassmorphism';
import productAppShowcase from './product/app-showcase';
import productFeatureGrid from './product/feature-grid';
import productAnnouncement from './product/announcement';
import productMinimalBadge from './product/minimal-badge';
import productDarkPremium from './product/dark-premium';

[
  productCenteredHero, productSplitScreen, productGradientWave, productNeonGlow,
  productGlassmorphism, productAppShowcase, productFeatureGrid, productAnnouncement,
  productMinimalBadge, productDarkPremium,
].forEach(registerTemplate);

// SaaS
import saasDashboardPreview from './saas/dashboard-preview';
import saasPricingHighlight from './saas/pricing-highlight';
import saasMetricShowcase from './saas/metric-showcase';
import saasTestimonialBanner from './saas/testimonial-banner';
import saasComparison from './saas/comparison';
import saasGradientMesh from './saas/gradient-mesh';
import saasCleanCorporate from './saas/clean-corporate';
import saasStartupBold from './saas/startup-bold';
import saasFeatureSpotlight from './saas/feature-spotlight';
import saasSocialProof from './saas/social-proof';

[
  saasDashboardPreview, saasPricingHighlight, saasMetricShowcase, saasTestimonialBanner,
  saasComparison, saasGradientMesh, saasCleanCorporate, saasStartupBold,
  saasFeatureSpotlight, saasSocialProof,
].forEach(registerTemplate);

// GitHub
import githubRepoCard from './github/repo-card';
import githubContributionGraph from './github/contribution-graph';
import githubReadmeHero from './github/readme-hero';
import githubReleaseNotes from './github/release-notes';
import githubLanguageBars from './github/language-bars';
import githubStarsBanner from './github/stars-banner';
import githubTerminalStyle from './github/terminal-style';
import githubCodeWindow from './github/code-window';
import githubMinimalBadge from './github/minimal-badge';
import githubMatrix from './github/matrix';

[
  githubRepoCard, githubContributionGraph, githubReadmeHero, githubReleaseNotes,
  githubLanguageBars, githubStarsBanner, githubTerminalStyle, githubCodeWindow,
  githubMinimalBadge, githubMatrix,
].forEach(registerTemplate);

// Event
import eventConference from './event/conference';
import eventMeetup from './event/meetup';
import eventWebinar from './event/webinar';
import eventWorkshop from './event/workshop';
import eventHackathon from './event/hackathon';
import eventSpeakerSpotlight from './event/speaker-spotlight';
import eventCountdown from './event/countdown';
import eventVenueMap from './event/venue-map';
import eventTicketCta from './event/ticket-cta';
import eventMultiSpeaker from './event/multi-speaker';

[
  eventConference, eventMeetup, eventWebinar, eventWorkshop, eventHackathon,
  eventSpeakerSpotlight, eventCountdown, eventVenueMap, eventTicketCta, eventMultiSpeaker,
].forEach(registerTemplate);

// Podcast
import podcastEpisodeCard from './podcast/episode-card';
import podcastWaveform from './podcast/waveform';
import podcastGuestSpotlight from './podcast/guest-spotlight';
import podcastSeriesBanner from './podcast/series-banner';
import podcastMinimalPlayer from './podcast/minimal-player';
import podcastVideoThumbnail from './podcast/video-thumbnail';
import podcastAudiogram from './podcast/audiogram';
import podcastShowNotes from './podcast/show-notes';

[
  podcastEpisodeCard, podcastWaveform, podcastGuestSpotlight, podcastSeriesBanner,
  podcastMinimalPlayer, podcastVideoThumbnail, podcastAudiogram, podcastShowNotes,
].forEach(registerTemplate);

// Developer
import developerPortfolioCard from './developer/portfolio-card';
import developerTechStack from './developer/tech-stack';
import developerTerminalBio from './developer/terminal-bio';
import developerGradientProfile from './developer/gradient-profile';
import developerSkillsRadar from './developer/skills-radar';
import developerGithubStyle from './developer/github-style';
import developerResumeHeader from './developer/resume-header';
import developerVscodeTheme from './developer/vscode-theme';
import developerLinkTree from './developer/link-tree';

[
  developerPortfolioCard, developerTechStack, developerTerminalBio, developerGradientProfile,
  developerSkillsRadar, developerGithubStyle, developerResumeHeader, developerVscodeTheme,
  developerLinkTree,
].forEach(registerTemplate);

// Newsletter
import newsletterIssueCard from './newsletter/issue-card';
import newsletterDigestBanner from './newsletter/digest-banner';
import newsletterPreviewText from './newsletter/preview-text';
import newsletterEditorial from './newsletter/editorial';
import newsletterCuratedLinks from './newsletter/curated-links';
import newsletterMinimalNumber from './newsletter/minimal-number';
import newsletterNewspaperFold from './newsletter/newspaper-fold';
import newsletterSubscriberCount from './newsletter/subscriber-count';

[
  newsletterIssueCard, newsletterDigestBanner, newsletterPreviewText, newsletterEditorial,
  newsletterCuratedLinks, newsletterMinimalNumber, newsletterNewspaperFold, newsletterSubscriberCount,
].forEach(registerTemplate);

// Quote
import quoteCenteredSerif from './quote/centered-serif';
import quoteGradientCard from './quote/gradient-card';
import quoteSpeechBubble from './quote/speech-bubble';
import quoteTwitterStyle from './quote/twitter-style';
import quoteBookPage from './quote/book-page';
import quoteBoldHighlight from './quote/bold-highlight';
import quoteMinimalDash from './quote/minimal-dash';
import quotePhotoBackground from './quote/photo-background';

[
  quoteCenteredSerif, quoteGradientCard, quoteSpeechBubble, quoteTwitterStyle,
  quoteBookPage, quoteBoldHighlight, quoteMinimalDash, quotePhotoBackground,
].forEach(registerTemplate);

// E-commerce
import ecommerceProductCard from './ecommerce/product-card';
import ecommerceSaleBanner from './ecommerce/sale-banner';
import ecommerceCollection from './ecommerce/collection';
import ecommerceReviewHighlight from './ecommerce/review-highlight';
import ecommercePriceDrop from './ecommerce/price-drop';
import ecommerceNewArrival from './ecommerce/new-arrival';
import ecommerceComparisonGrid from './ecommerce/comparison-grid';
import ecommerceBrandStory from './ecommerce/brand-story';

[
  ecommerceProductCard, ecommerceSaleBanner, ecommerceCollection, ecommerceReviewHighlight,
  ecommercePriceDrop, ecommerceNewArrival, ecommerceComparisonGrid, ecommerceBrandStory,
].forEach(registerTemplate);

// Job
import jobListingCard from './job/listing-card';
import jobTechStackRole from './job/tech-stack-role';
import jobRemoteBadge from './job/remote-badge';
import jobCompanyCulture from './job/company-culture';
import jobSalaryHighlight from './job/salary-highlight';
import jobTeamPhoto from './job/team-photo';
import jobStartupHiring from './job/startup-hiring';
import jobDeveloperRole from './job/developer-role';

[
  jobListingCard, jobTechStackRole, jobRemoteBadge, jobCompanyCulture,
  jobSalaryHighlight, jobTeamPhoto, jobStartupHiring, jobDeveloperRole,
].forEach(registerTemplate);

// Tutorial
import tutorialCourseCard from './tutorial/course-card';
import tutorialStepByStep from './tutorial/step-by-step';
import tutorialVideoLesson from './tutorial/video-lesson';
import tutorialDifficultyBadge from './tutorial/difficulty-badge';
import tutorialPlatformBranded from './tutorial/platform-branded';
import tutorialCodeTutorial from './tutorial/code-tutorial';
import tutorialWorkshopBanner from './tutorial/workshop-banner';
import tutorialCertification from './tutorial/certification';

[
  tutorialCourseCard, tutorialStepByStep, tutorialVideoLesson, tutorialDifficultyBadge,
  tutorialPlatformBranded, tutorialCodeTutorial, tutorialWorkshopBanner, tutorialCertification,
].forEach(registerTemplate);
