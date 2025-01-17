import { Assets } from 'pixi.js';
import AudioClip from '@/Audio/Clip';
import { AssetsBundle, Texture, UnresolvedAsset } from 'pixi.js';

const loadDefaultAssetsTexture = (): Promise<Record<string, Texture>> => new Promise(async (res, rej) => {
  try {
    const result: Record<string, Texture> = {};
    const defaultBundle = (await (await fetch('skin/skin-bundle.json')).json()) as AssetsBundle;
    await Assets.init({ manifest: { bundles: [ defaultBundle ] } });
    const bundleResult = await Assets.loadBundle('skin-default') as Record<string, Texture>;

    for (const asset of (defaultBundle.assets as UnresolvedAsset[])) {
      if (!asset.alias) continue;
      result[asset.alias as string] = bundleResult[asset.alias as string];
    }

    res(result);
  } catch (e) {
    rej(e);
  }
});

class AssetsManager {
  readonly textures: Record<string, Texture> = {};
  readonly sounds: Record<string, AudioClip> = {};

  constructor() {
    loadDefaultAssetsTexture()
      .then((e) => {
        for (const name in e) {
          this.textures[name] = e[name];
        }
      })
      .catch(e => {throw e});
  }
}

const assets = new AssetsManager();
export default assets;
export { AssetsManager };
