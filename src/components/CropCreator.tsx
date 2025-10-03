import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CodeBlock from "@theme/CodeBlock";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useColorMode} from "@docusaurus/theme-common";

// Reuse your extracted components
import LayeredPic from "./LayeredPic";
import TintPic from "./TintPic";

type CropType = "animal" | "crop" | "food" | "monster" | "nature";

interface CropDef {
  id: string;
  tier: number;
  material: string;
  color: string; // #RRGGBB
  type: CropType;
  dependencies: Record<string, string>;
  translations?: Record<string, string>;
}

const CROP_TYPES: CropType[] = ["animal", "crop", "food", "monster", "nature"];
const TIER_MIN = 1,
  TIER_MAX = 7;

const SEED_GRAY_URL =
  "https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/seed_crop.png";
const FRUIT_BASE = (t: CropType) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}.png`;
const FRUIT_OVERLAY = (t: CropType) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/fruit_${t}_overlay.png`;
const CROP_BLOCK_BASE = (t: CropType) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7.png`;
const CROP_BLOCK_OVERLAY = (t: CropType) =>
  `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/block/${t}_stage_7_overlay.png`;

function seedTextureUrl(tier: number): string {
  return `https://raw.githubusercontent.com/MUYUTwilighter/croparia-if/master/common/src/main/resources/assets/croparia/textures/item/croparia${tier}.png`;
}

// Normalize to #RRGGBB (strip alpha if #AARRGGBB pasted)
function toRgbHex(input: string): string {
  const s = (input || "").trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(s))
    return s.startsWith("#") ? s.toUpperCase() : `#${s.toUpperCase()}`;
  const m = /^#?([0-9a-fA-F]{8})$/.exec(s);
  if (m) {
    const n = parseInt(m[1], 16);
    const rgb = n & 0x00ffffff;
    return `#${rgb.toString(16).padStart(6, "0")}`.toUpperCase();
  }
  return "#FFFFFF";
}

// Small helpers to manage editable kv-lists
type Pair = { key: string; value: string };

function toRecord(pairs: Pair[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const {key, value} of pairs) {
    const k = key.trim();
    if (!k) continue;
    out[k] = value;
  }
  return out;
}

// Basic validators (non-blocking; show helper texts)
const rxModId = /^[a-z0-9_:-]+$/; // e.g. 'minecraft', 'modid:thing'
const rxLang = /^[a-z]{2}(_[a-z]{2})?$/i; // en, en_us, zh_cn...

export default function CropCreator() {
  const {colorMode} = useColorMode();
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {mode: colorMode === "dark" ? "dark" : "light"},
      }),
    [colorMode]
  );

  // Base form
  const [id, setId] = React.useState("");
  const [type, setType] = React.useState<CropType>("crop");
  const [tier, setTier] = React.useState(1);
  const [material, setMaterial] = React.useState("c:ingots/material");
  const [color, setColor] = React.useState("#FFFFFF");
  const rgbHex = React.useMemo(() => toRgbHex(color), [color]);

  // Editable dependencies and translations
  const [deps, setDeps] = React.useState<Pair[]>([{key: "", value: ""}]);
  const [langs, setLangs] = React.useState<Pair[]>([
    {key: "en_us", value: ""},
  ]);

  // Add / remove rows
  const addRow = (which: "deps" | "langs") => {
    if (which === "deps") setDeps((p) => [...p, {key: "", value: ""}]);
    else setLangs((p) => [...p, {key: "", value: ""}]);
  };
  const removeRow = (which: "deps" | "langs", idx: number) => {
    if (which === "deps") setDeps((p) => p.filter((_, i) => i !== idx));
    else setLangs((p) => p.filter((_, i) => i !== idx));
  };
  const updateRow =
    (which: "deps" | "langs", idx: number, field: "key" | "value") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (which === "deps") {
          setDeps((p) => p.map((row, i) => (i === idx ? {...row, [field]: v} : row)));
        } else {
          setLangs((p) => p.map((row, i) => (i === idx ? {...row, [field]: v} : row)));
        }
      };

  // Live JSON
  const cropJson: CropDef = {
    id: id.trim() || "croparia:your_crop",
    tier,
    material: material.trim() || "c:ingots/material",
    color: rgbHex,
    type,
    dependencies: toRecord(deps),
    translations: toRecord(langs),
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        {/* LEFT: base fields */}
        <Grid size={{xs: 12, md: 5, lg: 4}}>
          <Paper variant="outlined" sx={{p: 2, mb: 2}}>
            <Typography variant="subtitle1" gutterBottom>
              Basic
            </Typography>
            <Divider sx={{mb: 2}}/>

            <TextField
              label="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              fullWidth
              sx={{mb: 2}}
              placeholder="croparia:iron"
            />

            <TextField
              select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as CropType)}
              fullWidth
              sx={{mb: 2}}
            >
              {CROP_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="body2" sx={{mb: 1}}>
              Tier: <Chip size="small" label={tier}/>
            </Typography>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <img
                src={seedTextureUrl(tier)}
                width={20}
                height={20}
                style={{imageRendering: "pixelated"}}
                alt="tier"
              />
              <Slider
                value={tier}
                min={TIER_MIN}
                max={TIER_MAX}
                step={1}
                marks
                onChange={(_, v) => setTier(Number(v))}
                sx={{ml: 1}}
              />
            </Box>

            <TextField
              label="Material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              fullWidth
              sx={{my: 2}}
              placeholder="c:ingots/material"
            />

            <Box>
              <Typography variant="body2" sx={{mb: 0.5}}>
                Color (#RRGGBB)
              </Typography>
              <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                <input
                  type="color"
                  value={rgbHex}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    width: 40,
                    height: 32,
                    border: "1px solid var(--ifm-color-emphasis-300)",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                  }}
                />
                <TextField
                  value={rgbHex}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{width: 140}}
                  slotProps={{input: {spellCheck: false}}}
                />
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 0.5,
                    background: rgbHex,
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Dependencies editor */}
          <Paper variant="outlined" sx={{p: 2, mb: 2}}>
            <Typography variant="subtitle1" gutterBottom>
              Dependencies
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
              Map of <b>mod id</b> → <b>translation key</b>. When the mod is present, the crop items
              will use the given key to resolve their names.
            </Typography>
            <Divider sx={{mb: 2}}/>

            {deps.map((row, i) => {
              const modErr = row.key.trim() !== "" && !rxModId.test(row.key.trim());
              return (
                <Box key={`dep-${i}`} sx={{display: "flex", gap: 1, mb: 1}}>
                  <TextField
                    size="small"
                    label="Mod ID"
                    value={row.key}
                    onChange={updateRow("deps", i, "key")}
                    placeholder="examplemod"
                    error={modErr}
                    helperText={modErr ? "Use lowercase letters, digits, _: -" : " "}
                    sx={{flex: 1}}
                  />
                  <TextField
                    size="small"
                    label="Translation Key"
                    value={row.value}
                    onChange={updateRow("deps", i, "value")}
                    placeholder="item.examplemod.iron_crop"
                    sx={{flex: 1.4}}
                  />
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        aria-label="remove dependency row"
                        onClick={() => removeRow("deps", i)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              );
            })}

            <Button
              startIcon={<AddIcon/>}
              size="small"
              onClick={() => addRow("deps")}
              sx={{mt: 1}}
            >
              Add dependency
            </Button>
          </Paper>

          {/* Translations editor */}
          <Paper variant="outlined" sx={{p: 2}}>
            <Typography variant="subtitle1" gutterBottom>
              Translations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
              Map of <b>language</b> → <b>text</b> (e.g. <code>en_us</code>, <code>zh_cn</code>).
              Croparia IF will generate language files from these entries.
            </Typography>
            <Divider sx={{mb: 2}}/>

            {langs.map((row, i) => {
              const langErr = row.key.trim() !== "" && !rxLang.test(row.key.trim());
              return (
                <Box key={`lang-${i}`} sx={{display: "flex", gap: 1, mb: 1}}>
                  <TextField
                    size="small"
                    label="Language"
                    value={row.key}
                    onChange={updateRow("langs", i, "key")}
                    placeholder="en_us"
                    error={langErr}
                    helperText={langErr ? "Use pattern like en, en_us, zh_cn" : " "}
                    sx={{width: 140}}
                    slotProps={{input: {style: {textTransform: "lowercase"}}}}
                  />
                  <TextField
                    size="small"
                    label="Text"
                    value={row.value}
                    onChange={updateRow("langs", i, "value")}
                    placeholder="Iron Crop"
                    sx={{flex: 1}}
                  />
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        aria-label="remove translation row"
                        onClick={() => removeRow("langs", i)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              );
            })}

            <Button
              startIcon={<AddIcon/>}
              size="small"
              onClick={() => addRow("langs")}
              sx={{mt: 1}}
            >
              Add translation
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT: live preview */}
        <Grid size={{xs: 12, md: 7, lg: 8}}>
          <Paper variant="outlined" sx={{p: 2}}>
            <Typography variant="subtitle1" gutterBottom>
              Preview
            </Typography>
            <Divider sx={{mb: 2}}/>

            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 4}}>
                <Box
                  sx={{textAlign: "center", justifyItems: "center"}}
                  style={{borderRadius: 8, paddingBlock: 8}}
                >
                  <Typography variant="body2" color="text.secondary">
                    Seed
                  </Typography>
                  <TintPic src={SEED_GRAY_URL} color={rgbHex} size={64}/>
                </Box>
              </Grid>

              <Grid size={{xs: 12, sm: 4}}>
                <Box
                  sx={{textAlign: "center", justifyItems: "center"}}
                  style={{borderRadius: 8, paddingBlock: 8}}
                >
                  <Typography variant="body2" color="text.secondary">
                    Fruit
                  </Typography>
                  <LayeredPic
                    baseSrc={FRUIT_BASE(type)}
                    overlaySrc={FRUIT_OVERLAY(type)}
                    overlayTint={rgbHex}
                    size={64}
                  />
                </Box>
              </Grid>

              <Grid size={{xs: 12, sm: 4}}>
                <Box
                  sx={{textAlign: "center", justifyItems: "center"}}
                  style={{borderRadius: 8, paddingBlock: 8}}
                >
                  <Typography variant="body2" color="text.secondary">
                    Crop
                  </Typography>
                  <LayeredPic
                    baseSrc={CROP_BLOCK_BASE(type)}
                    overlaySrc={CROP_BLOCK_OVERLAY(type)}
                    overlayTint={rgbHex}
                    size={64}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* JSON output */}
          <Paper variant="outlined" sx={{mt: 2, p: 2}}>
            <Typography variant="subtitle1" gutterBottom>
              Generated JSON
            </Typography>
            <CodeBlock language="json">{JSON.stringify(cropJson, null, 2)}</CodeBlock>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
