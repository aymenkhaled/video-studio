import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// Loads CI-fetched JSON (public/art/index.json, public/geo/*.json) once per bundle; renders wait for it.
const cache = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

const load = (path: string) => {
  if (!pending.has(path)) {
    pending.set(
      path,
      fetch(staticFile(path))
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
        .then((j) => {
          cache.set(path, j);
          return j;
        }),
    );
  }
  return pending.get(path)!;
};

/** JSON from public/, or null while loading / when missing (local preview without fetched media). */
export const usePublicJson = <T,>(path: string, enabled = true): T | null => {
  const [data, setData] = useState<T | null>(() => (cache.get(path) as T) ?? null);
  const [handle] = useState(() => (enabled && !cache.has(path) ? delayRender(`load ${path}`) : null));
  useEffect(() => {
    if (!enabled || cache.has(path)) {
      if (handle !== null) continueRender(handle);
      return;
    }
    load(path).then((j) => {
      setData(j as T);
      if (handle !== null) continueRender(handle);
    });
  }, [path, enabled, handle]);
  return data;
};

export type ArtIndex = Record<string, {w: number; h: number; layers: number; credit: string}>;
export const useArtIndex = () => usePublicJson<ArtIndex>('art/index.json');
export const artSrc = (id: string, layer = 0) => staticFile(layer ? `art/${id}_l${layer}.webp` : `art/${id}.webp`);
