interface MobileEditorTabsProps {
  activeTab: 'templates' | 'customize' | 'export';
  onTabChange: (tab: 'templates' | 'customize' | 'export') => void;
}

export function MobileEditorTabs({ activeTab, onTabChange }: MobileEditorTabsProps) {
  const tabs = [
    { id: 'templates' as const, label: 'Templates' },
    { id: 'customize' as const, label: 'Customize' },
    { id: 'export' as const, label: 'Export' },
  ];

  return (
    <div className="mobile-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
