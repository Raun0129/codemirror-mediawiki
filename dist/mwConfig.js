// node_modules/@bhsd/common/dist/index.mjs
var CDN = "https://testingcf.jsdelivr.net";
var getObject = (key) => JSON.parse(String(localStorage.getItem(key)));
var setObject = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
var parseVersion = (version) => version.split(".", 3).map(Number);
var compareVersion = (version, baseVersion) => {
  const [major, minor] = parseVersion(version), [baseMajor, baseMinor] = parseVersion(baseVersion);
  return major > baseMajor || major === baseMajor && minor >= baseMinor;
};

// node_modules/@bhsd/common/dist/cm.mjs
var otherParserFunctions = /* @__PURE__ */ new Set(["msg", "raw", "subst", "safesubst"]);
var getConfig = (magicWords, rule, flip) => {
  const words = magicWords.filter(rule);
  return Object.fromEntries(
    (flip === void 0 ? words : words.filter(({ "case-sensitive": i }) => i !== flip)).flatMap(({ aliases, name: n, "case-sensitive": i }) => aliases.map((alias) => ({
      alias: (i ? alias : alias.toLowerCase()).replace(/:$/u, ""),
      name: n
    }))).map(({ alias, name: n }) => [alias, n])
  );
};
var getParserConfig = (minConfig, mwConfig) => {
  const {
    tags,
    doubleUnderscore,
    urlProtocols,
    functionSynonyms,
    variableIDs,
    functionHooks,
    redirection
  } = mwConfig, [insensitive, sensitive] = functionSynonyms, behaviorSwitch = doubleUnderscore.map(
    (obj, i) => Object.entries(obj).map(([k, v]) => [
      k.slice(2, -2),
      i && typeof v === "string" ? v.toUpperCase() : v
    ])
  );
  for (const [k, v] of Object.entries(insensitive)) {
    if (k in sensitive) {
      delete insensitive[k];
    } else {
      insensitive[k] = v.toLowerCase();
    }
  }
  return {
    ...minConfig,
    ext: Object.keys(tags),
    parserFunction: [{ ...insensitive }, { ...sensitive, "=": "=" }, [], []],
    doubleUnderscore: [
      ...behaviorSwitch.map((entries) => entries.map(([k]) => k)),
      ...behaviorSwitch.map(Object.fromEntries)
    ],
    protocol: urlProtocols.replace(/\|\\?\/\\?\/$|\\(?=[:/])/gu, ""),
    ...variableIDs && { variable: [.../* @__PURE__ */ new Set([...variableIDs, "="])] },
    ...functionHooks && { functionHook: [.../* @__PURE__ */ new Set([...functionHooks.map((s) => s.toLowerCase()), "msgnw"])] },
    ...redirection && { redirection: redirection.map((s) => s.toLowerCase()) }
  };
};
var getVariants = (variants) => {
  var _a;
  return (_a = variants == null ? void 0 : variants.map(({ code }) => code)) != null ? _a : [];
};
var getKeywords = (magicwords, web) => ({
  img: Object.fromEntries(
    magicwords.filter(({ name: n }) => n.startsWith("img_") && n !== "img_lossy").flatMap(({ name: n, aliases }) => {
      const k = web ? n : n.slice(4).replace(/_/gu, "-");
      return (n === "img_alt" ? aliases.filter((alias) => alias.includes("$1")) : aliases).map((alias) => [alias, k]);
    })
  ),
  redirection: magicwords.find(({ name: n }) => n === "redirect").aliases.map((s) => s.toLowerCase())
});

// src/static.ts
var getStaticMwConfig = ({
  variable,
  parserFunction: [p0, p1, ...p2],
  protocol,
  nsid,
  functionHook,
  variants,
  redirection,
  ext,
  doubleUnderscore: [d0, d1, d2, d3],
  img
}, modes) => ({
  tags: Object.fromEntries(ext.map((s) => [s, true])),
  tagModes: modes,
  doubleUnderscore: [
    Object.fromEntries((d2 && d0.length === 0 ? Object.keys(d2) : d0).map((s) => [`__${s}__`, true])),
    Object.fromEntries((d3 && d1.length === 0 ? Object.keys(d3) : d1).map((s) => [`__${s}__`, true]))
  ],
  functionHooks: functionHook,
  variableIDs: variable,
  functionSynonyms: [
    {
      ...p0,
      ...Object.fromEntries(p2.flat().map((s) => [s, s]))
    },
    Array.isArray(p1) ? Object.fromEntries(p1.map((s) => [s, s.toLowerCase()])) : { ...p1 }
  ],
  urlProtocols: `${protocol}|//`,
  nsid,
  img: Object.fromEntries(Object.entries(img).map(([k, v]) => [k, `img_${v}`])),
  variants,
  redirection
});

// mw/config.ts
var others = /* @__PURE__ */ new Set([...otherParserFunctions, "msgnw"]);
var getConfigPair = (magicWords, rule) => [true, false].map((bool) => getConfig(magicWords, rule, bool));
var setConfig = (config) => {
  mw.config.set("extCodeMirrorConfig", config);
};
var getMwConfig = async (modes) => {
  var _a, _b, _c;
  const ALL_SETTINGS_CACHE = (_a = getObject("InPageEditMwConfig")) != null ? _a : {}, SITE_ID = typeof mw === "object" ? mw.config.get("wgServerName") + mw.config.get("wgScriptPath") : location.origin, SITE_SETTINGS = ALL_SETTINGS_CACHE[SITE_ID], VALID = Number(SITE_SETTINGS == null ? void 0 : SITE_SETTINGS.time) > Date.now() - 86400 * 1e3 * 30;
  if (mw.loader.getState("ext.CodeMirror") !== null && !VALID) {
    await mw.loader.using(
      mw.loader.getState("ext.CodeMirror.data") ? "ext.CodeMirror.data" : "ext.CodeMirror"
    );
  }
  let config = mw.config.get("extCodeMirrorConfig");
  if (!config && VALID) {
    ({ config } = SITE_SETTINGS);
    setConfig(config);
  }
  const isIPE = config && Object.values(config.functionSynonyms[0]).includes(true), nsid = mw.config.get("wgNamespaceIds");
  if ((config == null ? void 0 : config.img) && config.redirection && config.variants && config.variableIDs && config.functionHooks && !isIPE) {
    config.urlProtocols = config.urlProtocols.replace(/\\:/gu, ":");
    config.tagModes = modes;
    return { ...config, nsid };
  } else if (location.hostname.endsWith(".moegirl.org.cn")) {
    const parserConfig = await (await fetch(
      `${CDN}/npm/wikiparser-node/config/moegirl.json`
    )).json();
    setObject("wikilintConfig", parserConfig);
    config = getStaticMwConfig(parserConfig, modes);
  } else {
    await mw.loader.using("mediawiki.api");
    const { query: { general: { variants }, magicwords, extensiontags, functionhooks, variables } } = await new mw.Api().get({
      meta: "siteinfo",
      siprop: [
        "general",
        "magicwords",
        ...config && !isIPE ? [] : ["extensiontags"],
        ...(config == null ? void 0 : config.variableIDs) ? [] : ["variables"],
        ...(config == null ? void 0 : config.functionHooks) ? [] : ["functionhooks"]
      ],
      formatversion: "2"
    });
    if (config && !isIPE) {
      const { functionSynonyms: [insensitive] } = config;
      if (!("subst" in insensitive)) {
        Object.assign(insensitive, getConfig(magicwords, ({ name }) => others.has(name)));
      }
    } else {
      const functions = /* @__PURE__ */ new Set([
        ...functionhooks.map((s) => s.toLowerCase()),
        ...variables,
        ...others
      ]);
      config = {
        tags: Object.fromEntries(extensiontags.map((tag) => [tag.slice(1, -1), true])),
        functionSynonyms: getConfigPair(magicwords, ({ name }) => functions.has(name)),
        doubleUnderscore: getConfigPair(
          magicwords,
          ({ aliases }) => aliases.some((alias) => /^__.+__$/u.test(alias))
        )
      };
    }
    Object.assign(config, {
      ...getKeywords(magicwords, true),
      tagModes: modes,
      variants: getVariants(variants),
      urlProtocols: mw.config.get("wgUrlProtocols").replace(/\\:/gu, ":")
    });
    (_b = config.variableIDs) != null ? _b : config.variableIDs = variables;
    (_c = config.functionHooks) != null ? _c : config.functionHooks = functionhooks.map((s) => s.toLowerCase());
    if (!config.functionHooks.includes("msgnw")) {
      config.functionHooks.push("msgnw");
    }
  }
  setConfig(config);
  ALL_SETTINGS_CACHE[SITE_ID] = { config, time: Date.now() };
  setObject("InPageEditMwConfig", ALL_SETTINGS_CACHE);
  return { ...config, nsid };
};
var getParserConfig2 = (minConfig, mwConfig) => {
  let config = getObject("wikilintConfig");
  if (config) {
    return config;
  }
  const { nsid, variants, functionSynonyms, img } = mwConfig, [insensitive, sensitive] = functionSynonyms;
  config = {
    ...getParserConfig(minConfig, mwConfig),
    namespaces: mw.config.get("wgFormattedNamespaces"),
    nsid,
    variants
  };
  if (location.hostname.endsWith(".moegirl.org.cn")) {
    config.html[2].push("img");
  }
  const noCM = mw.loader.getState("ext.CodeMirror") === null;
  for (const [key, val] of Object.entries(insensitive)) {
    if (others.has(val) && val !== "msgnw") {
      delete config.parserFunction[0][key];
      config.parserFunction[val === "msg" || val === "raw" ? 2 : 3].push(key);
    } else if (noCM && !key.startsWith("#")) {
      config.parserFunction[0][`#${key}`] = val;
    }
  }
  if (typeof wikiparse !== "object" || !compareVersion(wikiparse.version, "1.15") || Object.values(sensitive).includes(true)) {
    config.parserFunction[1] = Object.keys(config.parserFunction[1]);
  }
  for (const [key, val] of Object.entries(img)) {
    config.img[key] = val.slice(4).replace(/_/gu, "-");
  }
  return config;
};
export {
  getMwConfig,
  getParserConfig2 as getParserConfig
};
