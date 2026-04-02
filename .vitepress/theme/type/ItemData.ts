import {withBase} from "vitepress";

export interface LocaleMap {
  zh: string
  en: string
  es: string

  [locale: string]: string | undefined
}

export interface ItemPayload {
  name: LocaleMap
  registerName: string
  CreativeTabName: LocaleMap
  OredictList: string | string[]
  smallIcon: string
  largeIcon: string
  maxStacksSize: number
  minTool?: string
}

export interface ItemData {
  name: LocaleMap
  registerName: string
  CreativeTabName: LocaleMap
  OredictList: string[]
  smallIcon: string
  largeIcon: string
  smallIconSrc: string
  largeIconSrc: string
  maxStacksSize: number
  minTool?: string
}

export const ItemData = {
  async fetch(id: string): Promise<ItemData> {
    try {
      const [namespace, path] = parseRegisterName(id);
      const response = await fetch(`${withBase(`/data/item/${namespace}/${path}.json`)}`);
      if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
      const item = await response.json() as ItemPayload;
      return normalizeItem(item, id);
    } catch {
      return ItemData.createFallbackItem(id);
    }
  },

  createFallbackItem(registerName: string, name?: LocaleMap): ItemData {
    return normalizeItem(
      {
        name: name ?? {
          zh: registerName,
          en: registerName,
          es: registerName
        },
        registerName,
        OredictList: [],
        maxStacksSize: 99,
        smallIcon: FALLBACK_SMALL_ICON,
        largeIcon: FALLBACK_LARGE_ICON,
        CreativeTabName: {
          'zh': "未知",
          'en': 'Unknown',
          'es': ''
        }
      },
      registerName
    )
  }
}

const FALLBACK_SMALL_ICON = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACIklEQVR4XmMsV8j9zzCAgIlhgAELw3/SAuDP779gJ//5+RvF6SxsLGA+M5RmJNJjgyAEGPG79T80hD6//gz2k7yxApjW9TRA8eON/dfA/NuHb4BpPnF+MM1IwPwBDwGcuQDu81efwD6JmZEMps2jrfHG7tVdl8Hy04P6iAqJQZAGcPjnz68/YBkVGzUUn396+RHMbzOvhcQxEyQN1ZxpBfO13XTBtLI1RN+La0/BfBZ2Vqw2DeIQ+AHJ57YpTiguX1u+HMz/9e0XmP73B1Iu7OrdCuYHtoaDaQUTJTD99NKjIRoCHHycYJcvyZgLphckzQTTMHEOXg4w/+PzD2BaRlcOJaTePX4L5jMx4Y/lwZsGYCUYzMcMaODb+69gEV1vSIloGmEJ5sPKj/PrToP5sBKRAQcYvCEAczB6Wf7r20+wlBY0v6etyEPxW41qEZjPI8wDpgd9XcDCQCT4/w/SboDlf3SfF4tngk1iZmUG06wcrESZPPjTAMwbf6Elnqq9BorPtjSuA/P//YWUiLDygdiQHTohAGvz3T9+B+y5BJYQMM3LyQemCeV3XCEydELgN7R21ITmf4csV7Cnru68CKYPz9oPptm52RlIAUMnBGD1voSmNNiDKlaQFs/vH5B2wf4pu4dqCBDZM2KBlmxXt0Pi/NMLSDvgzf1XqD4nsac1+HtGsBTNzAIp498/gbR03tyD+JyJBeIHWDnBQCIY8BAAAC8Ele8DHGvlAAAAAElFTkSuQmCC"
const FALLBACK_LARGE_ICON = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAE4UlEQVR4XmMsV8j9zzAKRmwIMI3G/cgOgdEEwDCaAEYLgREcAqMlwGgJMFoAMIyWAKOJYKSGwGgVMMLTPgvD/6E9DPDn91+8Ufjn52+KopiFjQWvfmYC8oyDPIGNlgCjjcDR+n+0ETiaBkZsCIxWAaNVwGj2H60CRtPAaBUwmgZGZgiwMDAObE/1P4FxiM+vP+ONGXljBbzyup4GFMXsjf3X8Oq/ffgGXnk+cX688owDHP6jjcDRRuBo4T/aCBxNAyM2BEargNEqYDT7j1YBo2lgtAoYTQMjMwRovi+AYD//1Se8IR8zIxmvvHm09YDG3NVdl/HaPz2oD6/8QI8TjDYCRxuBo4X/SA6B0RJgtAQYLQFGS4DRNDBiQ2C0ChitAkaz/0gOARZae/7Prz94rVCxUcMrT6if/+nlR7z628xr8cozMuFfD1FzphWvfm03Xbzyytb4/ffi2lO8+lnYWWkaRaNVwAgvAEcTwGgCGG0DjOQQGC0BRkuA0RJgtAQYTQMjNgRGq4ARnvhpPw7wA//+fNsUJ4qiYG35crz6f337hVf+3x/85wvs6t2KV39gazheeQUTJbzyTy89wis/Og4wWj3RNARGq4ARnsBGE8BoAhgtY0dyCIyWAKMlwGgJMFoCjKaBERsCNB8H4ODjxBu4SzLm4pVfkDQTrzwh8zl4OfDq//j8A155GV05ihLHu8dv8epnYhrYWni0DTDaBhgt/0fbAKNpYMSGwGgVMFoFjGb/0SpgNA2MVgGjaWBkhgDNxwEInYNHqB9PabR8e/8VrxG63vjPETSNsMSrn9D5B+fXncarn9D5ALROlqONwNFG4GjhP5JDYLQEGC0BRkuA0RJgNA2M2BAYrQJGq4DR7D+SQ4BloD1P6Xn5v779xOsFLQL799NW5FEUBDWqRXj18wjz4JUfvS9gtAAa0BAYbQOM8AQ4mgBGE8BoGTySQ2C0BBgtAUZLgNESYDQNjNgQYBnsPv//7z9eJxLa/09pP79YPBOv/cyszHjlWTlYB3UQj7YBRtsAo+X/SA6B0RJgtAQYLQFGS4DRNDBiQ2C0ChitAkaz/0gOgUE/DvCXwDl+qvYaFMXflsZ1ePX/+4v/HEFC5w8M9sQ1WgWMVgGjVcBoL2A0DYzYEBitAkargNHsP1oFjKaB0SpgNA2MzBAY9OMALGz4nXj/+B28MZfAEoJXnpeTD6/8QO/fp3WyHG0EjjYCRwv/0UbgaBoYsSEwWgWMVgGj2X+0ChhNA6NVwGgaGB0HGJQh8JvAvYOaBPb/O2S54vXX1Z0X8cofnrUfrzw7N/uQTjmjjcDRRuBo4T/aCBxNAyM2BEargNEqYDT7j1YBo2lgtAoYTQMjMwQG/XoAQvf7S2hK4405FSs1vPK/f/zCK79/ym688qPjAKNFx5AOgdFewGgvYDQLj+QQGC0BRkuA0RJgtAQYTQMjNgRGq4ARnvhZGP7/H9RBwELgnL2r2/HP53968QGv/97cf4VXnmA/f5CHH6HIHS0BRhuBow2A0UbgaBoYsSEwWgWMVgGj2X+0ChhNA6NVwGgaGJkhwMLAyDiofc7Mgv88/vdP3uJ1/5t7+Pv5TCz4m0GEzicY6slmtBE42ggcLfxHG4GjaWC0ETiaBkZmCIy2AUbbAKN5f7QNMJoGRmwIAABai5avKmsgYgAAAABJRU5ErkJggg=="

function parseRegisterName(registerName: string): [string, string] {
  const [namespace, ...pathParts] = registerName.split(':');
  const path = pathParts.join(':');
  if (!namespace || !path) throw new Error(`Invalid item registerName: ${registerName}`);
  return [namespace, path];
}

function normalizeOredictList(list: string | string[] | undefined): string[] {
  if (Array.isArray(list)) return list.map(entry => entry.trim()).filter(Boolean);
  if (typeof list !== 'string') return [];

  const normalized = list.trim();
  if (normalized === '[]') return [];

  return normalized
    .replace(/^\[/, '')
    .replace(/]$/, '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
}

export function toImageSrc(base64: string, mimeType = 'image/png'): string {
  if (!base64) return '';
  if (base64.startsWith('data:')) return base64;
  return `data:${mimeType};base64,${base64}`;
}

function normalizeItem(payload: ItemPayload, fallbackRegisterName = payload.registerName): ItemData {
  const smallIcon = payload.smallIcon || FALLBACK_SMALL_ICON
  const largeIcon = payload.largeIcon || FALLBACK_LARGE_ICON

  return {
    name: payload.name ?? {
      zh: fallbackRegisterName,
      en: fallbackRegisterName,
      es: fallbackRegisterName
    },
    registerName: payload.registerName || fallbackRegisterName,
    OredictList: normalizeOredictList(payload.OredictList),
    smallIcon,
    largeIcon,
    smallIconSrc: toImageSrc(smallIcon),
    largeIconSrc: toImageSrc(largeIcon),
    maxStacksSize: payload.maxStacksSize ?? 64,
    minTool: payload.minTool,
    CreativeTabName: payload.CreativeTabName
  }
}