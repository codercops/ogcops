interface TemplateThumbnailProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export function TemplateThumbnail({ id, name, isActive, onClick }: TemplateThumbnailProps) {
  return (
    <button
      type="button"
      className={`template-thumb ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title={name}
    >
      <div className="template-thumb-preview">
        <img
          src={`/api/templates/${id}/thumbnail.png`}
          alt={name}
          loading="lazy"
          width={600}
          height={315}
        />
      </div>
      <span className="template-thumb-name">{name}</span>
      {isActive && <span className="template-thumb-check" aria-hidden="true" />}
    </button>
  );
}
