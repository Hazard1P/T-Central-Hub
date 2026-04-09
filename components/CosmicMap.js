import Image from 'next/image';
import Link from 'next/link';

const nodes = [
  { href: '/servers/arma3-cth', label: 'Arma3 CTH', style: { top: '22%', left: '26%' } },
  { href: '/servers/rust-vanilla', label: 'Rust Vanilla', style: { top: '70%', left: '42%' } },
  { href: '/donate', label: 'Support Hub', style: { top: '27%', left: '73%' } },
  { href: '/information', label: 'Information', style: { top: '77%', left: '76%' } }
];

export default function CosmicMap() {
  return (
    <div className="cosmic-map">
      <Image
        src="/cosmic-map.jpg"
        alt="Cosmic system map used as the homepage navigation artwork"
        width={1152}
        height={1536}
        className="cosmic-image"
        priority
      />
      <div className="cosmic-overlay" />
      {nodes.map((node) => (
        <Link key={node.label} href={node.href} className="map-node" style={node.style}>
          <span className="map-node-dot" />
          <span className="map-node-label">{node.label}</span>
        </Link>
      ))}
      <div className="map-caption">
        <p className="eyebrow">Interactive navigation</p>
        <h3>Click the map nodes to move through the hub.</h3>
      </div>
    </div>
  );
}
