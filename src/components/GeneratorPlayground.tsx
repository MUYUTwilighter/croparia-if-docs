import React, {ReactNode} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
// Docusaurus themed code block with built-in copy button
// If outside Docusaurus, you can swap this with a simple <pre><code> ...
import CodeBlock from "@theme/CodeBlock";
import {useColorMode} from "@docusaurus/theme-common";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import BlockInput from "@site/src/type/BlockInput";

const GENERATOR_TYPES = ['croparia:generator', 'croparia:aggregated', 'croparia:lang', 'croparia:recipe_wizard'] as const;
const FILE_TYPES = ['toml', 'cdg', 'json'] as const;
const REGISTRIES = ['croparia:crops', 'croparia:elements'] as const; // suggestions only

// ---------- Utilities ----------
function langFor(fileType: typeof FILE_TYPES[number]) {
  if (fileType === 'json') return 'json';
  if (fileType === 'toml') return 'toml';
  // no perfect syntax for cdg; ini works okay
  return 'ini';
}

function trimIndent(str: string) {
  // Remove leading whitespace common to all lines, then trim.
  const lines = str.replace(/^\n+|\n+$/g, '').split('\n');
  const indents = lines
    .filter(l => l.trim().length)
    .map(l => l.match(/^\s*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map(l => l.slice(min)).join('\n').trim();
}

function onlyContentPlaceholders(template: string): { ok: boolean; offenders: string[] } {
  const offenders: string[] = [];
  const re = /\$\{([^}]+)}/g; // find ${...}
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) {
    const inner = m[1].trim();
    if (inner !== 'content') offenders.push(m[0]);
  }
  return {ok: offenders.length === 0, offenders};
}

// ---------- Reusable Inputs ----------
function RegistryField({value, onChange}: { value: string; onChange: (v: string) => void }) {
  return (
    <Autocomplete
      freeSolo
      options={[...REGISTRIES]}
      value={value}
      onChange={(_, v) => onChange(v ?? '')}
      onInputChange={(_, v) => onChange(v)}
      renderInput={(params) => (
        <TextField {...params} label="Registry" placeholder="e.g. croparia:crops or custom:registry"/>
      )}
    />
  );
}

function BlockInputField({value, onChange}: { value: BlockInput; onChange: (v: BlockInput) => void }) {
  const [valueInput, setValueInput] = React.useState(value.id ?? value.tag ? `#${value.tag}` : '');

  console.log("Editing");
  console.log(value);

  let properties = new Map<string, string>(Object.entries(value.properties || {}));

  function property(properties: Map<string, string>) {
    const components: ReactNode[] = [];
    properties.forEach((v, k) => {
      components.push(<Stack key={k} direction="row" spacing={2}>
        <IconButton onClick={() => {
          properties.delete(k);
          onChange({...value, properties: Object.fromEntries(properties)});
        }}>
          <DeleteIcon/>
        </IconButton>
        <TextField label="Property Key" value={k} onChange={() => {
          properties.set(k, v);
          onChange({...value, properties: Object.fromEntries(properties)});
        }}/>
        <TextField label="Property Value" value={v} onChange={e => {
          properties.set(k, e.target.value);
          onChange({...value, properties: Object.fromEntries(properties)});
        }}/>
      </Stack>);
    });
    return components;
  }

  return <>
    <Typography variant="subtitle1">Block</Typography>
    <Typography variant="body2" color="text.secondary">
      Which block to be right-clicked by the Recipe Wizard so that this generator will be triggered and generate the
      recipe.
    </Typography>
    <TextField fullWidth label="Block ID / Tag" value={valueInput} onChange={e => {
      const input = e.target.value;
      setValueInput(input);
      if (input.length === 0) onChange({properties: value.properties});
      if (input.startsWith("#")) onChange({tag: input.slice(1), properties: value.properties});
      else onChange({id: input, properties: value.properties});
    }}/>
    <Typography variant="body2" color="text.secondary">
      Block Properties (optional)
    </Typography>
    <Stack>
      {property(properties)}
      <Stack sx={{width: '100%', my: 1, alignItems: 'center', justifyItems: 'center', display: 'flex'}}>
        <IconButton onClick={() => {
          const k = "key" + (properties.size + 1);
          properties.set(k, "");
          onChange({...value, properties: Object.fromEntries(properties)});
        }}>
          <AddIcon/>
        </IconButton>
      </Stack>
    </Stack>
  </>
}

function WhitelistField({value, onChange}: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={value}
      onChange={(_, v) => onChange(v)}
      renderValue={(val: readonly string[], getTagProps) =>
        val.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({index})} key={`${option}_${index}`}/>
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Whitelist Entry IDs" placeholder="Add modid then press Enter"/>
      )}
    />
  );
}

function ExtensionsField({value, onChange}: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={value}
      onChange={(_, v) => onChange(v)}
      renderValue={(val: readonly string[], getTagProps) =>
        val.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({index})} key={`${option}_${index}`}/>
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Extension IDs" placeholder="Add id of extension in use then press Enter"/>
      )}
    />
  );
}

function DependenciesField({
                             value,
                             onChange
                           }: {
  value: string[][];
  onChange: (v: string[][]) => void;
}) {
  const addGroup = () => onChange([...value, []]);
  const removeGroup = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const updateGroup = (i: number, group: string[]) => onChange(value.map((g, idx) => (idx === i ? group : g)));

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1">Dependencies</Typography>
        <Tooltip title="Add a group. Each group means any one of these mod IDs may be present.">
          <IconButton size="small" onClick={addGroup}>
            <AddIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Semantics: For each group, if <b>any</b> mod ID in that group is loaded, the group is satisfied. All groups must
        be satisfied for the generator to run.
      </Typography>
      <Stack spacing={1}>
        {value.length === 0 && (
          <Typography variant="body2" color="text.secondary">No groups. Click + to add one (optional).</Typography>
        )}
        {value.map((group, i) => (
          <Card key={i} variant="outlined">
            <CardHeader
              title={`Group #${i + 1}`}
              action={
                <Tooltip title="Remove group">
                  <IconButton onClick={() => removeGroup(i)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={group}
                onChange={(_, v) => updateGroup(i, v)}
                renderValue={(val: readonly string[], getTagProps) =>
                  val.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({index})} key={`${option}_${index}`}/>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mod IDs in this group"
                    placeholder="Add a modid then press Enter"
                  />
                )}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

function BooleanToggles({enabled, setEnabled, startup, setStartup}: {
  enabled: boolean; setEnabled: (v: boolean) => void;
  startup?: boolean; setStartup?: (v: boolean) => void;
}) {
  return (
    <Stack direction="row" spacing={2}>
      <FormControlLabel control={<Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}/>}
                        label="Enabled"/>
      {startup && setStartup ?
        <FormControlLabel control={<Switch checked={startup} onChange={e => setStartup(e.target.checked)}/>}
                          label="Startup"/> : <></>}
    </Stack>
  );
}

function FileTypeSelect({value, onChange}: {
  value: typeof FILE_TYPES[number];
  onChange: (v: typeof FILE_TYPES[number]) => void
}) {
  return (
    <FormControl fullWidth>
      <InputLabel id="filetype-label">File Type</InputLabel>
      <Select labelId="filetype-label" label="File Type" value={value}
              onChange={(e) => onChange(e.target.value as any)} variant="outlined">
        {FILE_TYPES.map(ft => (
          <MenuItem key={ft} value={ft}>{ft}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function PathField({value, onChange}: { value: string; onChange: (v: string) => void }) {
  return <TextField fullWidth label="Path" value={value} onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. data/croparia/generators/xyz.toml"/>
}

function TemplateField({value, onChange, label = 'Template'}: {
  value: string;
  onChange: (v: string) => void;
  label?: string
}) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Your template content"
      multiline
      minRows={6}
    />
  );
}

function ContentField({value, onChange}: { value: string; onChange: (v: string) => void }) {
  return <TextField fullWidth label="Content (used by aggregated)" value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="The variable content to be injected as ${content}"/>
}

function ErrorBanner({error}: { error: string | null }) {
  if (!error) return null;
  return (
    <Box sx={{p: 1, borderRadius: 1, bgcolor: 'error.main', color: 'error.contrastText'}}>
      <Typography variant="body2">{error}</Typography>
    </Box>
  );
}

function GeneratedPreview({code, fileType}: { code: string; fileType: typeof FILE_TYPES[number] }) {
  if (!code) return null;
  return <Card variant="outlined">
    <CardHeader title="Generated Output"/>
    <CardContent>
      <CodeBlock language={langFor(fileType)}>
        {code}
      </CodeBlock>
    </CardContent>
  </Card>;
}

function Line() {
  return <hr style={{border: "gray 1px solid"}}/>;
}

// ---------- Generators ----------

function isDependenciesEmpty(dependencies: string[][]) {
  return dependencies.length === 0 || dependencies.find(g => g.length !== 0) === undefined;
}

function isBlockEmpty(block: BlockInput) {
  return !block.id && !block.tag;
}

function Generator() {
  const [dependencies, setDependencies] = React.useState<string[][]>([]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [startup, setStartup] = React.useState<boolean>(false);
  const [registry, setRegistry] = React.useState<string>('');
  const [whitelist, setWhitelist] = React.useState<string[]>([]);
  const [path, setPath] = React.useState<string>('');
  const [template, setTemplate] = React.useState<string>('');
  const [fileType, setFileType] = React.useState<typeof FILE_TYPES[number]>('toml');

  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<string>('');

  const generate = React.useCallback(() => {
    setError(null);
    if (!registry) {
      setError('Registry cannot be empty');
      return;
    }
    if (!path) {
      setError('Path cannot be empty');
      return;
    }
    if (!template) {
      setError('Template cannot be empty');
      return;
    }

    if (fileType === 'toml') {
      const code = trimIndent(`
          ${enabled ? '' : 'enabled = false'}
          ${isDependenciesEmpty(dependencies) ? '' : `dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}]`}
          ${startup ? 'startup = true' : ''}
          ${whitelist.length === 0 ? '' : `whitelist = ["${whitelist.join('", "')}"]`}
          registry = "${registry}"
          path = "${path}"
          template = '''${template}'''
        `);
      setOutput(code);
    } else if (fileType === 'cdg') {
      const code = trimIndent(`
          ${enabled ? '' : '@enabled = false;'}
          ${isDependenciesEmpty(dependencies) ? '' : `@dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}];`}
          ${startup ? '@startup = true;' : ''}
          ${whitelist.length === 0 ? '' : `@whitelist = ["${whitelist.join('", "')}"];`}
          @registry = ${registry};
          @path = ${path};
          ${template}
        `);
      setOutput(code);
    } else {
      const json = {
        ...(enabled ? {} : {enabled: false}),
        ...(isDependenciesEmpty(dependencies) ? {dependencies} : {}),
        ...(startup ? {startup: true} : {}),
        ...(whitelist.length === 0 ? {} : {whitelist}),
        registry,
        path,
        template
      };
      setOutput(JSON.stringify(json, null, 2));
    }
  }, [enabled, dependencies, startup, whitelist, registry, path, template, fileType]);

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, md: 7}}>
        <Card variant="outlined">
          <CardHeader title="Generator" subheader="Base generator with a template"/>
          <CardContent>
            <Stack spacing={2}>
              <BooleanToggles enabled={enabled} setEnabled={setEnabled} startup={startup} setStartup={setStartup}/>
              <Line/>
              <DependenciesField value={dependencies} onChange={setDependencies}/>
              <Line/>
              <WhitelistField value={whitelist} onChange={setWhitelist}/>
              <Line/>
              <RegistryField value={registry} onChange={setRegistry}/>
              <Line/>
              <PathField value={path} onChange={setPath}/>
              <Line/>
              <TemplateField value={template} onChange={setTemplate}/>
              <Line/>
              <FileTypeSelect value={fileType} onChange={setFileType}/>
              <Line/>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={generate}>Generate</Button>
                <Button onClick={() => {
                  setOutput('');
                  setError(null);
                }}>Clear</Button>
              </Stack>
              <ErrorBanner error={error}/>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{xs: 12, md: 5}}>
        <GeneratedPreview code={output} fileType={fileType}/>
      </Grid>
    </Grid>
  );
}

function Lang() {
  const [dependencies, setDependencies] = React.useState<string[][]>([]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [startup, setStartup] = React.useState<boolean>(false);
  const [registry, setRegistry] = React.useState<string>('');
  const [whitelist, setWhitelist] = React.useState<string[]>([]);
  const [path, setPath] = React.useState<string>('');
  const [template, setTemplate] = React.useState<string>('');
  const [fileType, setFileType] = React.useState<typeof FILE_TYPES[number]>('toml');

  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<string>('');

  const generate = React.useCallback(() => {
    try {
      setError(null);
      if (!registry) {
        setError('Registry cannot be empty');
        return;
      }
      if (!path) {
        setError('Path cannot be empty');
        return;
      }
      if (!template) {
        setError('Template cannot be empty');
        return;
      }

      if (fileType === 'toml') {
        const code = trimIndent(`
          type = "croparia:lang"
          ${enabled ? '' : 'enabled = false'}
          ${dependencies.length === 0 || (dependencies.map(d => d.length === 0).find(v => v === false) === undefined) ? `dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}]` : ''}
          ${startup ? 'startup = true' : ''}
          ${whitelist.length === 0 ? '' : `whitelist = ["${whitelist.join('", "')}"]`}
          registry = "${registry}"
          path = "${path}"
          template = '''${template}'''
        `);
        setOutput(code);
      } else if (fileType === 'cdg') {
        const code = trimIndent(`
          @type = croparia:lang;
          ${enabled ? '' : '@enabled = false;'}
          ${dependencies.length === 0 || (dependencies.map(d => d.length === 0).find(v => v === false) === undefined) ? `@dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}];` : ''}
          ${startup ? '@startup = true;' : ''}
          ${whitelist.length === 0 ? '' : `@whitelist = ["${whitelist.join('", "')}"];`}
          @registry = ${registry};
          @path = ${path};
          ${template}
        `);
        setOutput(code);
      } else {
        const json = {
          type: 'croparia:lang',
          ...(enabled ? {} : {enabled: false}),
          ...(dependencies.length === 0 || dependencies.map(d => d.length === 0).find(v => v === false) ? {dependencies} : {}),
          ...(startup ? {startup: true} : {}),
          ...(whitelist.length === 0 ? {} : {whitelist}),
          registry,
          path,
          template
        };
        setOutput(JSON.stringify(json, null, 2));
      }
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  }, [enabled, dependencies, startup, whitelist, registry, path, template, fileType]);

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, md: 7}}>
        <Card variant="outlined">
          <CardHeader title="Lang" subheader="Language generation with a template"/>
          <CardContent>
            <Stack spacing={2}>
              <BooleanToggles enabled={enabled} setEnabled={setEnabled} startup={startup} setStartup={setStartup}/>
              <Line/>
              <DependenciesField value={dependencies} onChange={setDependencies}/>
              <Line/>
              <WhitelistField value={whitelist} onChange={setWhitelist}/>
              <Line/>
              <RegistryField value={registry} onChange={setRegistry}/>
              <Line/>
              <PathField value={path} onChange={setPath}/>
              <Line/>
              <TemplateField value={template} onChange={setTemplate}/>
              <Line/>
              <FileTypeSelect value={fileType} onChange={setFileType}/>
              <Line/>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={generate}>Generate</Button>
                <Button onClick={() => {
                  setOutput('');
                  setError(null);
                }}>Clear</Button>
              </Stack>
              <ErrorBanner error={error}/>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{xs: 12, md: 5}}>
        <GeneratedPreview code={output} fileType={fileType}/>
      </Grid>
    </Grid>
  );
}

function Aggregated() {
  const [dependencies, setDependencies] = React.useState<string[][]>([]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [startup, setStartup] = React.useState<boolean>(false);
  const [registry, setRegistry] = React.useState<string>('');
  const [whitelist, setWhitelist] = React.useState<string[]>([]);
  const [path, setPath] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [template, setTemplate] = React.useState<string>('');
  const [fileType, setFileType] = React.useState<typeof FILE_TYPES[number]>('toml');

  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<string>('');

  const generate = React.useCallback(() => {
    setError(null);
    if (!registry) {
      setError('Registry cannot be empty');
      return;
    }
    if (!path) {
      setError('Path cannot be empty');
      return;
    }
    if (!template) {
      setError('Template cannot be empty');
      return;
    }

    // Enforce that template only uses ${content}
    const chk = onlyContentPlaceholders(template);
    if (!chk.ok) {
      setError(`Template can only use \${content} as a placeholder. Offending placeholders: ${chk.offenders.join(', ')}`);
      return;
    }

    if (fileType === 'toml') {
      const code = trimIndent(`
          type = "croparia:aggregated"
          ${enabled ? '' : 'enabled = false'}
          ${dependencies.length === 0 || (dependencies.map(d => d.length === 0).find(v => v === false) === undefined) ? `dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}]` : ''}
          ${startup ? 'startup = true' : ''}
          ${whitelist.length === 0 ? '' : `whitelist = ["${whitelist.join('", "')}"]`}
          registry = "${registry}"
          path = "${path}"
          content = "${content}"
          template = '''${template}'''
        `);
      setOutput(code);
    } else if (fileType === 'cdg') {
      const code = trimIndent(`
          @type = croparia:aggregated;
          ${enabled ? '' : '@enabled = false;'}
          ${dependencies.length === 0 || (dependencies.map(d => d.length === 0).find(v => v === false) === undefined) ? `@dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}];` : ''}
          ${startup ? '@startup = true;' : ''}
          ${whitelist.length === 0 ? '' : `@whitelist = ["${whitelist.join('", "')}"];`}
          @registry = ${registry};
          @content = "${content}";
          @path = ${path};
          ${template}
        `);
      setOutput(code);
    } else {
      const json = {
        type: 'croparia:aggregated',
        ...(enabled ? {} : {enabled: false}),
        ...(dependencies.length === 0 || (dependencies.map(d => d.length === 0).find(v => v === false) === undefined) ? {dependencies} : {}),
        ...(startup ? {startup: true} : {}),
        ...(whitelist.length === 0 ? {} : {whitelist}),
        registry,
        path,
        content,
        template
      };
      setOutput(JSON.stringify(json, null, 2));
    }
  }, [enabled, dependencies, startup, whitelist, registry, path, content, template, fileType]);

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, md: 7}}>
        <Card variant="outlined">
          <CardHeader title="Aggregated" subheader="Aggregates a list where template uses ${content}"/>
          <CardContent>
            <Stack spacing={2}>
              <BooleanToggles enabled={enabled} setEnabled={setEnabled} startup={startup} setStartup={setStartup}/>
              <Line/>
              <DependenciesField value={dependencies} onChange={setDependencies}/>
              <Line/>
              <WhitelistField value={whitelist} onChange={setWhitelist}/>
              <Line/>
              <RegistryField value={registry} onChange={setRegistry}/>
              <Line/>
              <PathField value={path} onChange={setPath}/>
              <Line/>
              <ContentField value={content} onChange={setContent}/>
              <Line/>
              <TemplateField value={template} onChange={setTemplate} label="Template (only ${content})"/>
              <Line/>
              <FileTypeSelect value={fileType} onChange={setFileType}/>
              <Line/>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={generate}>Generate</Button>
                <Button onClick={() => {
                  setOutput('');
                  setError(null);
                }}>Clear</Button>
              </Stack>
              <ErrorBanner error={error}/>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{xs: 12, md: 5}}>
        <GeneratedPreview code={output} fileType={fileType}/>
      </Grid>
    </Grid>
  );
}

function RecipeWizard() {
  const [dependencies, setDependencies] = React.useState<string[][]>([]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [block, setBlock] = React.useState<BlockInput>({});
  const [extensions, setExtensions] = React.useState<string[]>([]);
  const [path, setPath] = React.useState<string>('');
  const [template, setTemplate] = React.useState<string>('');
  const [fileType, setFileType] = React.useState<typeof FILE_TYPES[number]>('toml');

  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<string>('');

  const generate = React.useCallback(() => {
    setError(null);
    if (!path) {
      setError('Path cannot be empty');
      return;
    }
    if (!template) {
      setError('Template cannot be empty');
      return;
    }
    if (isBlockEmpty(block)) {
      setError('Block ID / Tag cannot be empty');
      return;
    }

    if (fileType === 'toml') {
      const code = trimIndent(`
          ${enabled ? '' : 'enabled = false'}
          ${isDependenciesEmpty(dependencies) ? '' : `dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}]`}
          ${block.properties && Object.keys(block.properties).length > 0 ? `block = ${JSON.stringify(block)}` : block.id ? `block = "${block.id}"` : `block = "#${block.tag}"`}
          ${extensions.length === 0 ? '' : `whitelist = ["${extensions.join('", "')}"]`}
          path = "${path}"
          template = '''${template}'''
        `);
      setOutput(code);
    } else if (fileType === 'cdg') {
      const code = trimIndent(`
          ${enabled ? '' : '@enabled = false;'}
          ${isDependenciesEmpty(dependencies) ? '' : `@dependencies = [${dependencies.map(d => `["${d.join('", "')}"]`).join(', ')}];`}
          ${block.properties && Object.keys(block.properties).length > 0 ? `@block = ${JSON.stringify(block)};` : block.id ? `@block = "${block.id}";` : `@block = "#${block.tag}";`}
          ${extensions.length === 0 ? '' : `@extensions = ["${extensions.join('", "')}"];`}
          @path = ${path};
          ${template}
        `);
      setOutput(code);
    } else {
      const json = {
        ...(enabled ? {} : {enabled: false}),
        ...(isDependenciesEmpty(dependencies) ? {dependencies} : {}),
        ...(!block.properties && Object.keys(block.properties).length > 0 ? {block} : block.id ? {block: block.id} : {block: `#${block.tag}`}),
        ...(extensions.length === 0 ? {} : {whitelist: extensions}),
        path,
        template
      };
      setOutput(JSON.stringify(json, null, 2));
    }
  }, [enabled, dependencies, block, extensions, path, template, fileType]);

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, md: 7}}>
        <Card variant="outlined">
          <CardHeader title="Recipe Wizard Generator" subheader="Describe how actions in world generates a recipe"/>
          <CardContent>
            <Stack spacing={2}>
              <BooleanToggles enabled={enabled} setEnabled={setEnabled}/>
              <Line/>
              <DependenciesField value={dependencies} onChange={setDependencies}/>
              <Line/>
              <BlockInputField value={block} onChange={setBlock}/>
              <Line/>
              <ExtensionsField value={extensions} onChange={setExtensions}/>
              <Line/>
              <PathField value={path} onChange={setPath}/>
              <Line/>
              <TemplateField value={template} onChange={setTemplate}/>
              <Line/>
              <FileTypeSelect value={fileType} onChange={setFileType}/>
              <Line/>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={generate}>Generate</Button>
                <Button onClick={() => {
                  setOutput('');
                  setError(null);
                }}>Clear</Button>
              </Stack>
              <ErrorBanner error={error}/>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{xs: 12, md: 5}}>
        <GeneratedPreview code={output} fileType={fileType}/>
      </Grid>
    </Grid>
  );
}

export default function GeneratorPlayground() {
  const [genType, setGenType] = React.useState<typeof GENERATOR_TYPES[number]>('croparia:generator');
  const {colorMode} = useColorMode();

  const theme = React.useMemo(() => createTheme({
    palette: {mode: colorMode === "dark" ? "dark" : "light"},
  }), [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{py: 3}}>
        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
          Build generator entries with live validation. The output renders in a Docusaurus code block so you can copy
          directly using its built-in button.
        </Typography>

        <Card variant="outlined" sx={{mb: 2}}>
          <CardContent>
            <Tabs
              value={genType}
              onChange={(_, v) => setGenType(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="croparia:generator" label="Generator"/>
              <Tab value="croparia:aggregated" label="Aggregated"/>
              <Tab value="croparia:lang" label="Lang"/>
              <Tab value="croparia:recipe_wizard" label="Recipe Wizard"/>
            </Tabs>
          </CardContent>
        </Card>

        {genType === 'croparia:generator' && <Generator/>}
        {genType === 'croparia:aggregated' && <Aggregated/>}
        {genType === 'croparia:lang' && <Lang/>}
        {genType === 'croparia:recipe_wizard' && <RecipeWizard/>}

        <Divider sx={{my: 3}}/>
        <Typography variant="caption" color="text.secondary">
          Notes: Registry field suggests two presets ({REGISTRIES.join(', ')}) but allows any custom value. Dependencies
          semantics: any-in-group AND across all groups.
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
