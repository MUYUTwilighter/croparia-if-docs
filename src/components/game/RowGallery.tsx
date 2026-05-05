export function RowGallery({ children }: { children: React.ReactNode }) {
  return (
    <div className="row-gallery">
      <div className="row-gallery__track">{children}</div>
    </div>
  );
}
