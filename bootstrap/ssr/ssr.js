import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { mergeDataIntoQueryString, router, formDataToObject, resetFormFields, shouldIntercept, setupProgress, createHeadManager } from "@inertiajs/core";
import React, { createContext, forwardRef, useRef, useMemo, useState, useEffect, useImperativeHandle, createElement, useCallback, useLayoutEffect, useContext } from "react";
import { isEqual, cloneDeep, escape } from "es-toolkit";
import { set, has, get } from "es-toolkit/compat";
import clsx, { clsx as clsx$1 } from "clsx";
import { motion as motion$1 } from "framer-motion";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Calendar as Calendar$1, MapPin, Scale, Home as Home$1, FileText, Users, Shield, Building, Gavel, Handshake, Briefcase, Landmark, FileCheck, UserCheck, DollarSign, Clock, CheckCircle, Star, Award, Target, Zap, ChevronLeft, ChevronRight, Search, User, ArrowLeft, GraduationCap, Filter, ChevronUp, ChevronDown, X, Maximize } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DOMPurify from "dompurify";
import { useForm as useForm$1 } from "react-hook-form";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AnimatePresence, motion } from "motion/react";
import createServer from "@inertiajs/core/server";
import ReactDOMServer from "react-dom/server";
var headContext = createContext(void 0);
headContext.displayName = "InertiaHeadContext";
var HeadContext_default = headContext;
var pageContext = createContext(void 0);
pageContext.displayName = "InertiaPageContext";
var PageContext_default = pageContext;
var currentIsInitialPage = true;
var routerIsInitialized = false;
var swapComponent = async () => {
  currentIsInitialPage = false;
};
function App({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate
}) {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: initialPage,
    key: null
  });
  const headManager = useMemo(() => {
    return createHeadManager(
      typeof window === "undefined",
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {
      })
    );
  }, []);
  if (!routerIsInitialized) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async (args) => swapComponent(args)
    });
    routerIsInitialized = true;
  }
  useEffect(() => {
    swapComponent = async ({ component, page, preserveState }) => {
      if (currentIsInitialPage) {
        currentIsInitialPage = false;
        return;
      }
      setCurrent((current2) => ({
        component,
        page,
        key: preserveState ? current2.key : Date.now()
      }));
    };
    router.on("navigate", () => headManager.forceUpdate());
  }, []);
  if (!current.component) {
    return createElement(
      HeadContext_default.Provider,
      { value: headManager },
      createElement(PageContext_default.Provider, { value: current.page }, null)
    );
  }
  const renderChildren = children || (({ Component, props, key }) => {
    const child = createElement(Component, { key, ...props });
    if (typeof Component.layout === "function") {
      return Component.layout(child);
    }
    if (Array.isArray(Component.layout)) {
      return Component.layout.concat(child).reverse().reduce((children2, Layout) => createElement(Layout, { children: children2, ...props }));
    }
    return child;
  });
  return createElement(
    HeadContext_default.Provider,
    { value: headManager },
    createElement(
      PageContext_default.Provider,
      { value: current.page },
      renderChildren({
        Component: current.component,
        key: current.key,
        props: current.page.props
      })
    )
  );
}
App.displayName = "Inertia";
async function createInertiaApp({
  id = "app",
  resolve,
  setup,
  title,
  progress = {},
  page,
  render
}) {
  const isServer = typeof window === "undefined";
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module);
  let head = [];
  const reactApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    return setup({
      // @ts-expect-error
      el,
      App,
      props: {
        initialPage,
        initialComponent,
        resolveComponent,
        titleCallback: title,
        onHeadUpdate: isServer ? (elements) => head = elements : null
      }
    });
  });
  if (!isServer && progress) {
    setupProgress(progress);
  }
  if (isServer) {
    const body = await render(
      createElement(
        "div",
        {
          id,
          "data-page": JSON.stringify(initialPage)
        },
        // @ts-expect-error
        reactApp
      )
    );
    return { head, body };
  }
}
function usePage() {
  const page = useContext(PageContext_default);
  if (!page) {
    throw new Error("usePage must be used within the Inertia component");
  }
  return page;
}
function useRemember(initialState, key) {
  const [state, setState] = useState(() => {
    const restored = router.restore(key);
    return restored !== void 0 ? restored : initialState;
  });
  useEffect(() => {
    router.remember(state, key);
  }, [state, key]);
  return [state, setState];
}
function useForm(rememberKeyOrInitialValues, maybeInitialValues) {
  const isMounted = useRef(null);
  const rememberKey = typeof rememberKeyOrInitialValues === "string" ? rememberKeyOrInitialValues : null;
  const [defaults, setDefaults] = useState(
    (typeof rememberKeyOrInitialValues === "string" ? maybeInitialValues : rememberKeyOrInitialValues) || {}
  );
  const cancelToken = useRef(null);
  const recentlySuccessfulTimeoutId = useRef(null);
  const [data, setData] = rememberKey ? useRemember(defaults, `${rememberKey}:data`) : useState(defaults);
  const [errors, setErrors] = rememberKey ? useRemember({}, `${rememberKey}:errors`) : useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const transform = useRef((data2) => data2);
  const isDirty = useMemo(() => !isEqual(data, defaults), [data, defaults]);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const submit = useCallback(
    (...args) => {
      const objectPassed = typeof args[0] === "object";
      const method = objectPassed ? args[0].method : args[0];
      const url = objectPassed ? args[0].url : args[1];
      const options = (objectPassed ? args[1] : args[2]) ?? {};
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken.current = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setWasSuccessful(false);
          setRecentlySuccessful(false);
          clearTimeout(recentlySuccessfulTimeoutId.current);
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setProcessing(true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setProgress(event);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: (page) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors({});
            setHasErrors(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            setDefaults(cloneDeep(data));
            recentlySuccessfulTimeoutId.current = setTimeout(() => {
              if (isMounted.current) {
                setRecentlySuccessful(false);
              }
            }, 2e3);
          }
          if (options.onSuccess) {
            return options.onSuccess(page);
          }
        },
        onError: (errors2) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors(errors2);
            setHasErrors(true);
          }
          if (options.onError) {
            return options.onError(errors2);
          }
        },
        onCancel: () => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          cancelToken.current = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      if (method === "delete") {
        router.delete(url, { ..._options, data: transform.current(data) });
      } else {
        router[method](url, transform.current(data), _options);
      }
    },
    [data, setErrors, transform]
  );
  const setDataFunction = useCallback(
    (keyOrData, maybeValue) => {
      if (typeof keyOrData === "string") {
        setData((data2) => set(cloneDeep(data2), keyOrData, maybeValue));
      } else if (typeof keyOrData === "function") {
        setData((data2) => keyOrData(data2));
      } else {
        setData(keyOrData);
      }
    },
    [setData]
  );
  const [dataAsDefaults, setDataAsDefaults] = useState(false);
  const setDefaultsFunction = useCallback(
    (fieldOrFields, maybeValue) => {
      if (typeof fieldOrFields === "undefined") {
        setDefaults(data);
        setDataAsDefaults(true);
      } else {
        setDefaults((defaults2) => {
          return typeof fieldOrFields === "string" ? set(cloneDeep(defaults2), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults2), fieldOrFields);
        });
      }
    },
    [data, setDefaults]
  );
  useLayoutEffect(() => {
    if (!dataAsDefaults) {
      return;
    }
    if (isDirty) {
      setDefaults(data);
    }
    setDataAsDefaults(false);
  }, [dataAsDefaults]);
  const reset = useCallback(
    (...fields) => {
      if (fields.length === 0) {
        setData(defaults);
      } else {
        setData(
          (data2) => fields.filter((key) => has(defaults, key)).reduce(
            (carry, key) => {
              return set(carry, key, get(defaults, key));
            },
            { ...data2 }
          )
        );
      }
    },
    [setData, defaults]
  );
  const setError = useCallback(
    (fieldOrFields, maybeValue) => {
      setErrors((errors2) => {
        const newErrors = {
          ...errors2,
          ...typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields
        };
        setHasErrors(Object.keys(newErrors).length > 0);
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const clearErrors = useCallback(
    (...fields) => {
      setErrors((errors2) => {
        const newErrors = Object.keys(errors2).reduce(
          (carry, field) => ({
            ...carry,
            ...fields.length > 0 && !fields.includes(field) ? { [field]: errors2[field] } : {}
          }),
          {}
        );
        setHasErrors(Object.keys(newErrors).length > 0);
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const resetAndClearErrors = useCallback(
    (...fields) => {
      reset(...fields);
      clearErrors(...fields);
    },
    [reset, clearErrors]
  );
  const createSubmitMethod = (method) => (url, options) => {
    submit(method, url, options);
  };
  const getMethod = useCallback(createSubmitMethod("get"), [submit]);
  const post = useCallback(createSubmitMethod("post"), [submit]);
  const put = useCallback(createSubmitMethod("put"), [submit]);
  const patch = useCallback(createSubmitMethod("patch"), [submit]);
  const deleteMethod = useCallback(createSubmitMethod("delete"), [submit]);
  const cancel = useCallback(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
  }, []);
  const transformFunction = useCallback((callback) => {
    transform.current = callback;
  }, []);
  return {
    data,
    setData: setDataFunction,
    isDirty,
    errors,
    hasErrors,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    transform: transformFunction,
    setDefaults: setDefaultsFunction,
    reset,
    setError,
    clearErrors,
    resetAndClearErrors,
    submit,
    get: getMethod,
    post,
    put,
    patch,
    delete: deleteMethod,
    cancel
  };
}
var noop = () => void 0;
var Form = forwardRef(
  ({
    action = "",
    method = "get",
    headers = {},
    queryStringArrayFormat = "brackets",
    errorBag = null,
    showProgress = true,
    transform = (data) => data,
    options = {},
    onStart = noop,
    onProgress = noop,
    onFinish = noop,
    onBefore = noop,
    onCancel = noop,
    onSuccess = noop,
    onError = noop,
    onCancelToken = noop,
    onSubmitComplete = noop,
    disableWhileProcessing = false,
    resetOnError = false,
    resetOnSuccess = false,
    setDefaultsOnSuccess = false,
    invalidateCacheTags = [],
    children,
    ...props
  }, ref) => {
    const form = useForm({});
    const formElement = useRef(null);
    const resolvedMethod = useMemo(() => {
      return typeof action === "object" ? action.method : method.toLowerCase();
    }, [action, method]);
    const [isDirty, setIsDirty] = useState(false);
    const defaultData = useRef(new FormData());
    const getFormData = () => new FormData(formElement.current);
    const getData = () => formDataToObject(getFormData());
    const updateDirtyState = (event) => setIsDirty(event.type === "reset" ? false : !isEqual(getData(), formDataToObject(defaultData.current)));
    useEffect(() => {
      defaultData.current = getFormData();
      const formEvents = ["input", "change", "reset"];
      formEvents.forEach((e) => formElement.current.addEventListener(e, updateDirtyState));
      return () => formEvents.forEach((e) => formElement.current?.removeEventListener(e, updateDirtyState));
    }, []);
    const reset = (...fields) => {
      resetFormFields(formElement.current, defaultData.current, fields);
    };
    const resetAndClearErrors = (...fields) => {
      form.clearErrors(...fields);
      reset(...fields);
    };
    const maybeReset = (resetOption) => {
      if (!resetOption) {
        return;
      }
      if (resetOption === true) {
        reset();
      } else if (resetOption.length > 0) {
        reset(...resetOption);
      }
    };
    const submit = () => {
      const [url, _data] = mergeDataIntoQueryString(
        resolvedMethod,
        typeof action === "object" ? action.url : action,
        getData(),
        queryStringArrayFormat
      );
      const submitOptions = {
        headers,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          onSuccess(...args);
          onSubmitComplete({
            reset,
            defaults
          });
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError(...args) {
          onError(...args);
          maybeReset(resetOnError);
        },
        ...options
      };
      form.transform(() => transform(_data));
      form.submit(resolvedMethod, url, submitOptions);
    };
    const defaults = () => {
      defaultData.current = getFormData();
      setIsDirty(false);
    };
    const exposed = () => ({
      errors: form.errors,
      hasErrors: form.hasErrors,
      processing: form.processing,
      progress: form.progress,
      wasSuccessful: form.wasSuccessful,
      recentlySuccessful: form.recentlySuccessful,
      isDirty,
      clearErrors: form.clearErrors,
      resetAndClearErrors,
      setError: form.setError,
      reset,
      submit,
      defaults
    });
    useImperativeHandle(ref, exposed, [form, isDirty, submit]);
    return createElement(
      "form",
      {
        ...props,
        ref: formElement,
        action: typeof action === "object" ? action.url : action,
        method: resolvedMethod,
        onSubmit: (event) => {
          event.preventDefault();
          submit();
        },
        inert: disableWhileProcessing && form.processing
      },
      typeof children === "function" ? children(exposed()) : children
    );
  }
);
Form.displayName = "InertiaForm";
var Head = function({ children, title }) {
  const headManager = useContext(HeadContext_default);
  const provider = useMemo(() => headManager.createProvider(), [headManager]);
  const isServer = typeof window === "undefined";
  useEffect(() => {
    provider.reconnect();
    provider.update(renderNodes(children));
    return () => {
      provider.disconnect();
    };
  }, [provider, children, title]);
  function isUnaryTag(node) {
    return [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ].indexOf(node.type) > -1;
  }
  function renderTagStart(node) {
    const attrs = Object.keys(node.props).reduce((carry, name) => {
      if (["head-key", "children", "dangerouslySetInnerHTML"].includes(name)) {
        return carry;
      }
      const value = String(node.props[name]);
      if (value === "") {
        return carry + ` ${name}`;
      } else {
        return carry + ` ${name}="${escape(value)}"`;
      }
    }, "");
    return `<${node.type}${attrs}>`;
  }
  function renderTagChildren(node) {
    return typeof node.props.children === "string" ? node.props.children : node.props.children.reduce((html, child) => html + renderTag(child), "");
  }
  function renderTag(node) {
    let html = renderTagStart(node);
    if (node.props.children) {
      html += renderTagChildren(node);
    }
    if (node.props.dangerouslySetInnerHTML) {
      html += node.props.dangerouslySetInnerHTML.__html;
    }
    if (!isUnaryTag(node)) {
      html += `</${node.type}>`;
    }
    return html;
  }
  function ensureNodeHasInertiaProp(node) {
    return React.cloneElement(node, {
      inertia: node.props["head-key"] !== void 0 ? node.props["head-key"] : ""
    });
  }
  function renderNode(node) {
    return renderTag(ensureNodeHasInertiaProp(node));
  }
  function renderNodes(nodes) {
    const computed = React.Children.toArray(nodes).filter((node) => node).map((node) => renderNode(node));
    if (title && !computed.find((tag) => tag.startsWith("<title"))) {
      computed.push(`<title inertia>${title}</title>`);
    }
    return computed;
  }
  if (isServer) {
    provider.update(renderNodes(children));
  }
  return null;
};
var Head_default = Head;
var noop2 = () => void 0;
var Link = forwardRef(
  ({
    children,
    as = "a",
    data = {},
    href = "",
    method = "get",
    preserveScroll = false,
    preserveState = null,
    replace = false,
    only = [],
    except = [],
    headers = {},
    queryStringArrayFormat = "brackets",
    async = false,
    onClick = noop2,
    onCancelToken = noop2,
    onBefore = noop2,
    onStart = noop2,
    onProgress = noop2,
    onFinish = noop2,
    onCancel = noop2,
    onSuccess = noop2,
    onError = noop2,
    onPrefetching = noop2,
    onPrefetched = noop2,
    prefetch = false,
    cacheFor = 0,
    cacheTags = [],
    ...props
  }, ref) => {
    const [inFlightCount, setInFlightCount] = useState(0);
    const hoverTimeout = useRef(null);
    const _method = useMemo(() => {
      return typeof href === "object" ? href.method : method.toLowerCase();
    }, [href, method]);
    const _as = useMemo(() => {
      if (typeof as !== "string") {
        return as;
      }
      return _method !== "get" ? "button" : as.toLowerCase();
    }, [as, _method]);
    const mergeDataArray = useMemo(
      () => mergeDataIntoQueryString(_method, typeof href === "object" ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat]
    );
    const url = useMemo(() => mergeDataArray[0], [mergeDataArray]);
    const _data = useMemo(() => mergeDataArray[1], [mergeDataArray]);
    const baseParams = useMemo(
      () => ({
        data: _data,
        method: _method,
        preserveScroll,
        preserveState: preserveState ?? _method !== "get",
        replace,
        only,
        except,
        headers,
        async
      }),
      [_data, _method, preserveScroll, preserveState, replace, only, except, headers, async]
    );
    const visitParams = useMemo(
      () => ({
        ...baseParams,
        onCancelToken,
        onBefore,
        onStart(visit) {
          setInFlightCount((count) => count + 1);
          onStart(visit);
        },
        onProgress,
        onFinish(visit) {
          setInFlightCount((count) => count - 1);
          onFinish(visit);
        },
        onCancel,
        onSuccess,
        onError
      }),
      [baseParams, onCancelToken, onBefore, onStart, onProgress, onFinish, onCancel, onSuccess, onError]
    );
    const prefetchModes = useMemo(
      () => {
        if (prefetch === true) {
          return ["hover"];
        }
        if (prefetch === false) {
          return [];
        }
        if (Array.isArray(prefetch)) {
          return prefetch;
        }
        return [prefetch];
      },
      Array.isArray(prefetch) ? prefetch : [prefetch]
    );
    const cacheForValue = useMemo(() => {
      if (cacheFor !== 0) {
        return cacheFor;
      }
      if (prefetchModes.length === 1 && prefetchModes[0] === "click") {
        return 0;
      }
      return 3e4;
    }, [cacheFor, prefetchModes]);
    const doPrefetch = useMemo(() => {
      return () => {
        router.prefetch(
          url,
          {
            ...baseParams,
            onPrefetching,
            onPrefetched
          },
          { cacheFor: cacheForValue, cacheTags }
        );
      };
    }, [url, baseParams, onPrefetching, onPrefetched, cacheForValue, cacheTags]);
    useEffect(() => {
      return () => {
        clearTimeout(hoverTimeout.current);
      };
    }, []);
    useEffect(() => {
      if (prefetchModes.includes("mount")) {
        setTimeout(() => doPrefetch());
      }
    }, prefetchModes);
    const regularEvents = {
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      }
    };
    const prefetchHoverEvents = {
      onMouseEnter: () => {
        hoverTimeout.current = window.setTimeout(() => {
          doPrefetch();
        }, 75);
      },
      onMouseLeave: () => {
        clearTimeout(hoverTimeout.current);
      },
      onClick: regularEvents.onClick
    };
    const prefetchClickEvents = {
      onMouseDown: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onMouseUp: (event) => {
        event.preventDefault();
        router.visit(url, visitParams);
      },
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
        }
      }
    };
    const elProps = useMemo(() => {
      if (_as === "button") {
        return { type: "button" };
      }
      if (_as === "a" || typeof _as !== "string") {
        return { href: url };
      }
      return {};
    }, [_as, url]);
    return createElement(
      _as,
      {
        ...props,
        ...elProps,
        ref,
        ...(() => {
          if (prefetchModes.includes("hover")) {
            return prefetchHoverEvents;
          }
          if (prefetchModes.includes("click")) {
            return prefetchClickEvents;
          }
          return regularEvents;
        })(),
        "data-loading": inFlightCount > 0 ? "" : void 0
      },
      children
    );
  }
);
Link.displayName = "InertiaLink";
var Link_default = Link;
var router3 = router;
const MenuIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-8 h-8 lg:w-10 lg:h-10",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M4 6h16M4 12h16m-7 6h7"
      }
    )
  }
);
const CloseIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-6 h-6",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M6 18L18 6M6 6l12 12"
      }
    )
  }
);
const Menu = ({ styles }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/acerca", label: "Nosotros" },
    { href: "/servicios", label: "Servicios" },
    { href: "/inmobiliaria", label: "Inmobiliaria" },
    { href: "/blog", label: "Blog" },
    { href: "/contacto", label: "Contacto" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: clsx("fixed z-10 w-full font-bold shadow-md", styles), children: [
    /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(Link_default, { href: "/", children: /* @__PURE__ */ jsx("img", { src: "/logo.webp", alt: "Brand Vergara y Asociados", className: "w-auto h-16 md:h-20 lg:h-24" }) }) }),
      /* @__PURE__ */ jsx("nav", { className: "items-center hidden gap-6 font-semibold lg:flex xl:gap-8", children: navLinks.map((link) => /* @__PURE__ */ jsx(
        Link_default,
        {
          href: link.href,
          className: "font-medium transition-colors duration-300 hover:text-golden",
          children: link.label
        },
        link.href
      )) }),
      /* @__PURE__ */ jsx(
        MainButton,
        {
          as: Link_default,
          href: "/contacto",
          className: "py-2 hidden lg:block lg:py-3",
          children: "Reserva tu consulta"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex items-center lg:hidden", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleMenu,
          className: "text-greyki hover:text-golden focus:outline-none",
          "aria-label": "Toggle menu",
          children: isMenuOpen ? /* @__PURE__ */ jsx(CloseIcon, {}) : /* @__PURE__ */ jsx(MenuIcon, {})
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isMenuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
          className: "fixed inset-0 z-40 bg-black/50 lg:hidden",
          onClick: () => setIsMenuOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 200,
            duration: 0.4
          },
          className: "fixed top-0 right-0 z-50 w-full h-full max-w-sm bg-darki shadow-2xl lg:hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-golden/20", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ jsx("img", { src: "/logo.webp", alt: "Brand Vergara y Asociados", className: "w-10 h-10" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white font-prata", children: "Menú" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setIsMenuOpen(false),
                  className: "p-2 text-white transition-colors duration-300 hover:text-golden focus:outline-none",
                  "aria-label": "Close menu",
                  children: /* @__PURE__ */ jsx(CloseIcon, {})
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("nav", { className: "flex flex-col px-6 py-8 space-y-6", children: [
              navLinks.map((link, index) => /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: 50 },
                  animate: { opacity: 1, x: 0 },
                  transition: {
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  },
                  children: /* @__PURE__ */ jsx(
                    Link_default,
                    {
                      href: link.href,
                      className: "block text-xl font-medium text-white transition-all duration-300 hover:text-golden hover:translate-x-2 font-prata",
                      onClick: () => setIsMenuOpen(false),
                      children: link.label
                    }
                  )
                },
                link.href
              )),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    delay: navLinks.length * 0.1 + 0.2,
                    duration: 0.4,
                    ease: "easeOut"
                  },
                  className: "pt-8 mt-8 border-t border-golden/20",
                  children: /* @__PURE__ */ jsx(
                    MainButton,
                    {
                      as: Link_default,
                      href: "/contacto",
                      onClick: () => setIsMenuOpen(false),
                      className: "w-full justify-center",
                      children: "Reserva tu consulta"
                    }
                  )
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
};
const Info = ({ styles = null, corporativeInfo = null }) => {
  const email = corporativeInfo?.corporative_email || "admin@inmobiliariavergarayabogados.com";
  const phone = corporativeInfo?.corporative_whatsapp || "+57 323-3344-34";
  const linkedin = corporativeInfo?.corporative_linkedin;
  const instagram = corporativeInfo?.corporative_instagram;
  const facebook = corporativeInfo?.corporative_facebook;
  const twitter = corporativeInfo?.corporative_twitter;
  return /* @__PURE__ */ jsx("header", { className: clsx$1(styles), style: { height: "var(--info-top-height)" }, children: /* @__PURE__ */ jsxs("div", { className: "container flex-col items-center justify-end hidden gap-4 py-4 mx-auto text-xs text-grayki md:flex md:flex-row ", children: [
    /* @__PURE__ */ jsxs("p", { className: "flex gap-2 px-3 text-gray-300 border-r border-greyki", children: [
      /* @__PURE__ */ jsx(Mail, { className: "w-4 h-full" }),
      email
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "flex gap-2 px-3 text-gray-300 border-r border-greyki", children: [
      /* @__PURE__ */ jsx(Phone, { className: "w-4 h-full" }),
      " ",
      phone
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
      facebook && /* @__PURE__ */ jsx("a", { href: facebook, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
        Facebook,
        {
          strokeWidth: 0.6,
          className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
        }
      ) }),
      twitter && /* @__PURE__ */ jsx("a", { href: twitter, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
        Twitter,
        {
          strokeWidth: 0.6,
          className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
        }
      ) }),
      instagram && /* @__PURE__ */ jsx("a", { href: instagram, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
        Instagram,
        {
          strokeWidth: 0.6,
          className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
        }
      ) }),
      linkedin && /* @__PURE__ */ jsx("a", { href: linkedin, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
        Linkedin,
        {
          strokeWidth: 0.6,
          className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
        }
      ) })
    ] })
  ] }) });
};
const MainHeader = ({ styles, corporativeInfo = null }) => {
  const [hideTopBar, setHideTopBar] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [isContactPage, setIsContactPage] = useState(false);
  useEffect(() => {
    const path = window.location.pathname;
    const isContact = path === "/contacto";
    setIsContactPage(isContact);
    if (isContact) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  }, []);
  useEffect(() => {
    if (isContactPage) {
      return;
    }
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 30) {
        setHideTopBar(true);
      } else if (currentScroll <= 350) {
        setHideTopBar(false);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, isContactPage]);
  return /* @__PURE__ */ jsx("header", { className: "fixed top-0 left-0 z-50 w-full", children: /* @__PURE__ */ jsxs(
    motion$1.div,
    {
      initial: { y: 0 },
      animate: { y: hideTopBar ? -56 : 0 },
      transition: { duration: 0.1, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(Info, { styles, corporativeInfo }),
        /* @__PURE__ */ jsx(Menu, { styles })
      ]
    }
  ) });
};
const Footer = ({ latestBlogs = [], corporativeInfo = null }) => {
  const facebook = corporativeInfo?.corporative_facebook;
  const twitter = corporativeInfo?.corporative_twitter;
  const instagram = corporativeInfo?.corporative_instagram;
  const linkedin = corporativeInfo?.corporative_linkedin;
  const email = corporativeInfo?.corporative_email || "contact@company.com";
  const phone = corporativeInfo?.corporative_whatsapp || "+1 (555) 123-4567";
  const address = corporativeInfo?.office_address || "Cl. 12 #8 05,\nSoacha Cundinamarca";
  const copyright = corporativeInfo?.copyright_text || "© 2024 Inmobiliaria Vergara y Abogados. Todos los derechos reservados.";
  return /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("footer", { className: "py-8 tracking-normal text-white bg-darki lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "px-4 mx-auto max-w-7xl lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-start text-left", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg", children: "Acerca de" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm leading-relaxed text-left text-graykiSecondary", children: "Somos una empresa líder dedicada a brindar servicios excepcionales y soluciones innovadoras a nuestros clientes en todo el mundo." }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-start space-x-4", children: [
          facebook && /* @__PURE__ */ jsx("a", { href: facebook, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" }) }),
          twitter && /* @__PURE__ */ jsx("a", { href: twitter, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" }) }),
          instagram && /* @__PURE__ */ jsx("a", { href: instagram, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" }) }),
          linkedin && /* @__PURE__ */ jsx("a", { href: linkedin, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg", children: "Últimos Artículos" }),
        latestBlogs.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-left md:space-y-3", children: latestBlogs.map((blog) => /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(
          Link_default,
          {
            href: `/blog/${blog.slug}`,
            className: "block text-left group",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-start space-x-2 lg:space-x-3", children: [
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 mt-0.5 text-graykiSecondary group-hover:text-golden transition-colors flex-shrink-0 lg:w-4 lg:h-4" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-left transition-colors text-graykiSecondary group-hover:text-white line-clamp-2 lg:text-sm", children: blog.title }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start mt-1 text-xs text-gray-400", children: [
                  /* @__PURE__ */ jsx(Calendar$1, { className: "w-3 h-3 mr-1" }),
                  new Date(blog.published_at).toLocaleDateString("es-CO", {
                    month: "short",
                    day: "numeric"
                  })
                ] })
              ] })
            ] })
          }
        ) }, blog.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-xs text-left text-graykiSecondary lg:text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-left", children: "No hay artículos disponibles." }),
          /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: "/blog",
              className: "inline-flex items-center mt-2 text-xs text-left transition-colors text-golden hover:text-white lg:text-sm",
              children: [
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 mr-1 lg:w-4 lg:h-4" }),
                "Ver blog"
              ]
            }
          )
        ] }),
        latestBlogs.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 text-left", children: /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/blog",
            className: "inline-flex items-center text-xs text-left transition-colors text-golden hover:text-white lg:text-sm",
            children: [
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 mr-1 lg:w-4 lg:h-4" }),
              "Ver todos los artículos"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg", children: "Información de Contacto" }),
        /* @__PURE__ */ jsxs("article", { className: "flex flex-col space-y-2 text-left md:space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-start space-x-2 lg:space-x-3", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-graykiSecondary mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-left text-graykiSecondary lg:text-sm whitespace-pre-line", children: address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start space-x-2 lg:space-x-3", children: [
            /* @__PURE__ */ jsx(Phone, { className: "flex-shrink-0 w-4 h-4 text-graykiSecondary" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-left text-graykiSecondary lg:text-sm", children: phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start space-x-2 lg:space-x-3", children: [
            /* @__PURE__ */ jsx(Mail, { className: "flex-shrink-0 w-4 h-4 text-graykiSecondary" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-left text-graykiSecondary lg:text-sm", children: email })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-base font-bold tracking-tight text-left font-prata lg:text-lg", children: "Enlaces Rápidos" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-left", children: [
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Inicio" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/acerca", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Nosotros" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/servicios", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Servicios" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/inmobiliaria", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Propiedades" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/blog", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Blog" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left", children: /* @__PURE__ */ jsx(Link_default, { href: "/contacto", className: "text-xs text-left transition-colors text-graykiSecondary hover:text-white lg:text-sm", children: "Contacto" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-8 mt-8 border-t border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-between gap-4 text-left md:flex-row", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-left text-graykiSecondary lg:text-sm", children: copyright }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-4 text-xs text-left text-graykiSecondary lg:text-sm", children: [
        /* @__PURE__ */ jsx(Link_default, { href: "/privacy", className: "text-left hover:text-white", children: "Política de Privacidad" }),
        /* @__PURE__ */ jsx(Link_default, { href: "/terms", className: "text-left hover:text-white", children: "Términos de Servicio" })
      ] })
    ] }) })
  ] }) }) });
};
const BannerInformative = ({ picture, title, description }) => {
  return /* @__PURE__ */ jsx("section", { className: "relative w-full h-auto", style: {
    backgroundImage: `url(${picture})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "250px"
  }, children: /* @__PURE__ */ jsx("div", { className: "absolute w-full h-full", children: /* @__PURE__ */ jsxs("div", { className: "container flex flex-col items-center justify-center w-full h-full gap-3 mx-auto text-center px-4 lg:gap-4 lg:px-8", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-medium tracking-wider font-prata text-whiteki sm:text-4xl md:text-5xl lg:text-6xl", children: [
      title,
      " "
    ] }),
    /* @__PURE__ */ jsx("p", { className: "px-4 text-sm text-golden sm:text-base md:px-2 lg:text-lg", children: description })
  ] }) }) });
};
const serviceIcons$1 = [
  Scale,
  Home$1,
  FileText,
  Users,
  Shield,
  Building,
  Gavel,
  Handshake,
  Briefcase,
  Landmark,
  FileCheck,
  UserCheck,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar$1,
  Clock,
  CheckCircle,
  Star,
  Award,
  Target,
  Zap
];
const getServiceIcon$1 = (serviceId) => {
  const iconIndex = serviceId % serviceIcons$1.length;
  return serviceIcons$1[iconIndex];
};
const CardService = ({ id, name, description, picture, slug }) => {
  const IconComponent = getServiceIcon$1(id);
  return /* @__PURE__ */ jsx(Link_default, { href: `/servicios/${slug || id}`, children: /* @__PURE__ */ jsxs("article", { className: "flex flex-col items-center justify-between h-full min-h-[320px] p-8 text-center transition-all duration-300 border cursor-pointer border-softGrey hover:shadow-lg hover:border-golden hover:scale-105 lg:p-16 lg:min-h-[380px] group", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center flex-grow", children: [
      /* @__PURE__ */ jsx("div", { className: "transition-colors duration-300 group-hover:text-golden", children: /* @__PURE__ */ jsx(IconComponent, { className: "w-16 h-16 text-golden lg:w-20 lg:h-20" }) }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-semibold tracking-wider text-gray-800 font-prata lg:text-xl group-hover:text-golden transition-colors duration-300", children: name }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-greyki lg:text-base flex-grow flex items-center justify-center", style: {
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "1.4",
        minHeight: "4.2em"
      }, children: description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-3 mx-auto mt-4 bg-softGrey group-hover:bg-golden transition-colors duration-300 lg:p-4 lg:mt-6", children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6 text-golden group-hover:text-white transition-colors duration-300" }) })
  ] }) });
};
const MotionWrapper = ({ children, delay = 0 }) => {
  return /* @__PURE__ */ jsx(
    motion$1.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: "easeOut", delay },
      viewport: { once: true, amount: 0.3 },
      children
    }
  );
};
const MainButton = ({
  as: Component = "button",
  href,
  className,
  children,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    Component,
    {
      ...props,
      href,
      className: clsx(
        "relative flex items-center justify-center px-8 py-2 text-lg font-semibold border overflow-hidden",
        "text-white border-softGrey bg-golden group transition-all duration-300 shadow-lg hover:shadow-xl",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "relative z-10 flex items-center transition-colors duration-300 group-hover:text-golden", children }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "absolute inset-0 left-0 w-0 transition-all duration-500 ease-out bg-darki group-hover:w-full"
          }
        )
      ]
    }
  );
};
const WhatsAppFloat = ({ corporativeInfo = null }) => {
  const phoneNumber = corporativeInfo?.corporative_whatsapp || "+573115327297";
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleWhatsAppClick = () => {
    const formattedNumber = phoneNumber.replace(/[\+\s\-\(\)]/g, "");
    const message = encodeURIComponent(
      "¡Hola! Me interesa obtener más información sobre sus servicios inmobiliarios. ¿Podrían ayudarme?"
    );
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleWhatsAppClick,
          onMouseEnter: () => {
            setIsHovered(true);
            setShowTooltip(true);
          },
          onMouseLeave: () => {
            setIsHovered(false);
            setTimeout(() => setShowTooltip(false), 300);
          },
          className: `
            relative flex items-center justify-center w-16 h-16 
            bg-green-500 hover:bg-green-600 text-white shadow-2xl 
            transition-all duration-300 transform hover:scale-110
            ${isHovered ? "animate-pulse" : ""}
          `,
          "aria-label": "Chat por WhatsApp",
          children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-8 h-8",
                fill: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: `absolute inset-0 bg-green-400 opacity-30 animate-ping ${isHovered ? "block" : "hidden"}` })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `
            absolute bottom-full right-0 mb-2 px-3 py-2 
            bg-darki text-whiteki text-sm font-dmsans whitespace-nowrap
            transform transition-all duration-300
            ${showTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
          `,
          children: [
            "¡Chatea con nosotros!",
            /* @__PURE__ */ jsx("div", { className: "absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-darki" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-24 right-6 z-40 md:hidden", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `
            px-3 py-1 bg-golden text-whiteki text-xs font-dmsans 
            shadow-lg transform transition-all duration-500
            ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}
          `,
        children: "WhatsApp"
      }
    ) })
  ] });
};
const defaultCarouselImages = [
  "/images/banner/classical-courthouse.png",
  "/images/banner/supreme-court-pillars.png"
];
const MainBanner = ({ homeBanner = null }) => {
  const carouselImages = homeBanner?.gallery && homeBanner.gallery.length > 0 ? homeBanner.gallery.map((img) => `/storage/${img}`) : defaultCarouselImages;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1);
    }, 6e3);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "-100%" },
        transition: { duration: 0.8, ease: "easeInOut" },
        className: "absolute inset-0",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: carouselImages[currentImageIndex] || "/placeholder.svg",
              alt: "Legal building",
              className: "object-cover w-full h-full"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50" })
        ]
      },
      currentImageIndex
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "mb-6 text-sm font-medium tracking-wide text-white/90 md:text-base",
          children: "# Vergara Abogados"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.4 },
          className: "mb-8",
          children: /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-light leading-relaxed tracking-tight text-white md:text-6xl lg:text-7xl font-prata", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block mr-4 text-transparent bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text", children: "Somos" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-4 py-2 mx-4 border rounded-lg bg-amber-600/20 backdrop-blur-sm border-amber-400/30", children: [
              /* @__PURE__ */ jsx(Scale, { className: "w-8 h-8 mr-2 md:w-12 md:h-12 text-amber-400" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-amber-200 md:text-4xl lg:text-5xl", children: " nosotros " })
            ] }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-white", children: "Profesional respaldo Juridico" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.8 },
          className: "max-w-2xl mb-12 text-lg leading-relaxed text-white/80 md:text-xl",
          children: "Haz realidad tus sueños de vivienda con respaldo legal y confianza. Experiencia que guía, compromiso que acompaña, tranquilidad que perdura."
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1 },
          children: /* @__PURE__ */ jsxs(MainButton, { as: Link_default, className: "max-w-[12rem] py-4", href: "/contacto", children: [
            "Contactanos",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute z-20 transform -translate-x-1/2 bottom-8 left-1/2", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: carouselImages.map((_, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setCurrentImageIndex(index),
        className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-golden scale-125" : "bg-red hover:bg-white/60"}`
      },
      index
    )) }) })
  ] });
};
const LawyerCard = ({ lawyer }) => {
  return /* @__PURE__ */ jsx(Link_default, { href: `/abogados/${lawyer.slug}`, className: "relative block overflow-hidden cursor-pointer group bg-softGrey h-96", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full", children: [
    lawyer.image ? /* @__PURE__ */ jsx(
      "img",
      {
        src: `/storage/${lawyer.image}`,
        alt: lawyer.name,
        className: "object-cover w-full h-full transition-all duration-500 filter grayscale group-hover:grayscale-0"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full h-full bg-gradient-to-br from-softGrey to-graykiSecondary", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-32 h-32 text-6xl rounded-full bg-whiteki text-darki font-prata", children: lawyer.name?.charAt(0) || "?" }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 overflow-hidden bg-gradient-to-t from-darki/90 via-darki/50 to-transparent", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-left transition-transform duration-500 transform group-hover:-translate-y-20", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-1 text-xl font-light text-whiteki font-prata", children: lawyer.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-golden font-dmsans", children: lawyer.profession || "Owner, Partner" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute text-left transition-transform duration-500 transform translate-y-full bottom-6 left-6 right-6 group-hover:translate-y-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 text-sm text-whiteki font-dmsans", children: [
          /* @__PURE__ */ jsx("p", { children: "Cl. 12 #8 05, Suite 1400" }),
          /* @__PURE__ */ jsx("p", { children: "Soacha, Cundinamarca 10018" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-whiteki font-dmsans", children: [
          lawyer.phone && /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: `tel:${lawyer.phone}`,
              className: "transition-colors duration-200 hover:text-golden",
              children: lawyer.phone
            }
          ) }),
          lawyer.email && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-greyki", children: "|" }),
            /* @__PURE__ */ jsx("button", { className: "transition-colors duration-200 hover:text-golden", children: "vCard" }),
            /* @__PURE__ */ jsx("span", { className: "text-greyki", children: "|" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `mailto:${lawyer.email}`,
                className: "transition-colors duration-200 hover:text-golden",
                children: "E-Mail"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] }) });
};
const LawyersSection = ({ lawyers = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  useEffect(() => {
    if (isMobile && lawyers.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => prevIndex === lawyers.length - 1 ? 0 : prevIndex + 1
        );
      }, 5e3);
      return () => clearInterval(interval);
    }
  }, [isMobile, lawyers.length]);
  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) => prevIndex === lawyers.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => prevIndex === 0 ? lawyers.length - 1 : prevIndex - 1
    );
  };
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  if (!lawyers || lawyers.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-whiteki", children: /* @__PURE__ */ jsxs("div", { className: "px-4 mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-16", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-4xl font-medium md:text-5xl text-darki font-prata", children: "Nuestro Equipo" }),
        /* @__PURE__ */ jsx("p", { className: "max-w-3xl text-lg text-greyki font-dmsans", children: "Contamos con amplia experiencia en todas las industrias. Brindamos a cada cliente una combinación de conocimiento profundo de la industria y perspectivas expertas para ofrecer ideas frescas y soluciones innovadoras." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxs(Link_default, { href: "/acerca", className: "flex items-center gap-2 text-lg transition-colors duration-300 text-golden hover:text-darki font-dmsans", children: [
        "Ver Todos",
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsx("div", { className: "hidden lg:grid lg:grid-cols-3 lg:gap-0", children: lawyers.slice(0, 3).map((lawyer, index) => /* @__PURE__ */ jsx(MotionWrapper, { delay: index * 0.1, children: /* @__PURE__ */ jsx(LawyerCard, { lawyer }) }, lawyer.id || index)) }) }),
    /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "relative lg:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-none", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex transition-transform duration-500 ease-in-out",
          style: { transform: `translateX(-${currentIndex * 100}%)` },
          children: lawyers.map((lawyer, index) => /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-full", children: /* @__PURE__ */ jsx(LawyerCard, { lawyer }) }, lawyer.id || index))
        }
      ) }),
      lawyers.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: prevSlide,
            className: "absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-darki text-whiteki hover:bg-golden",
            "aria-label": "Anterior abogado",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: nextSlide,
            className: "absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-darki text-whiteki hover:bg-golden",
            "aria-label": "Siguiente abogado",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-8 space-x-3", children: lawyers.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => goToSlide(index),
            className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-golden transform scale-125" : "bg-graykiSecondary hover:bg-golden"}`,
            "aria-label": `Ir al abogado ${index + 1}`
          },
          index
        )) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.4, children: lawyers.length > 3 && /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsx(MainButton, { as: Link_default, href: "/acerca", className: "px-8 py-4", children: "Ver Todo el Equipo" }) }) })
  ] }) });
};
const contactSchema = z.object({
  name: z.string().min(2, "Tu nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  lawyer_id: z.string().optional(),
  phone: z.string().optional().refine((v) => !v || /^\+?[0-9\s-]{7,15}$/.test(v), "Teléfono inválido"),
  observations: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" })
  })
});
const useContactForm = (onSuccess) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset
  } = useForm$1({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      observations: "",
      lawyer_id: "2",
      agree: true
    },
    mode: "onBlur"
  });
  const onSubmit = async (values) => {
    try {
      const response = await axios.post("/contacto/save-partial", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        lawyer_id: values.lawyer_id,
        observations: values.observations
      });
      if (response.data.success) {
        console.log("Form data saved:", response.data);
        if (onSuccess) {
          onSuccess(values, response.data.citation_id);
        }
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };
  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isSubmitSuccessful
  };
};
const ContactForm = ({ lawyers = null, onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting, isSubmitSuccessful } = useContactForm(onSuccess);
  const showSuccessMessage = isSubmitSuccessful && !onSuccess;
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl mx-auto 2xl:max-w-6xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-darki font-dmsans", children: "Información Personal" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-darki font-dmsans", children: "Nombre completo *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ...register("name"),
              placeholder: "Ingresa tu nombre completo",
              className: "w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600 font-dmsans", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-darki font-dmsans", children: "Correo electrónico *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ...register("email"),
              type: "email",
              placeholder: "tu@email.com",
              className: "w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600 font-dmsans", children: errors.email.message })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-darki font-dmsans", children: "Teléfono *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ...register("phone"),
              type: "tel",
              placeholder: "+57 300 123 4567",
              className: "w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
            }
          ),
          errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600 font-dmsans", children: errors.phone.message })
        ] }),
        lawyers && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-darki font-dmsans", children: "Abogado preferido" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              ...register("lawyer_id"),
              className: "w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki text-darki font-dmsans",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", className: "text-greyki", children: "Selecciona un abogado" }),
                /* @__PURE__ */ jsx("option", { value: "cualquiera", className: "text-darki", children: "Cualquiera disponible" }),
                lawyers.map((lawyer) => /* @__PURE__ */ jsxs("option", { value: lawyer.id, className: "text-darki", children: [
                  lawyer.name,
                  " - ",
                  lawyer.profession || "Abogado"
                ] }, lawyer.id))
              ]
            }
          ),
          errors.lawyer && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600 font-dmsans", children: errors.lawyer.message })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-darki font-dmsans", children: "Detalles del Caso" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-1 text-sm font-medium text-darki font-dmsans", children: "Cuéntanos tu situación *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            ...register("observations"),
            placeholder: "Describe brevemente tu caso o consulta legal...",
            rows: 4,
            className: "w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden resize-none focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
          }
        ),
        errors.observations && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600 font-dmsans", children: errors.observations.message })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 bg-softGrey/20", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            ...register("agree"),
            className: "w-4 h-4 mt-1 border-2 text-golden border-golden focus:ring-golden"
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-darki font-dmsans cursor-pointer", children: "Acepto la política de privacidad *" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-greyki font-dmsans", children: "Al enviar este formulario, aceptas que procesemos tu información de acuerdo con nuestra política de privacidad." })
        ] })
      ] }),
      errors.agree && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600 font-dmsans", children: errors.agree.message })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
      MainButton,
      {
        type: "submit",
        disabled: isSubmitting,
        className: "w-full py-3 text-base font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed",
        children: isSubmitting ? "Enviando..." : "Enviar Solicitud"
      }
    ) }),
    showSuccessMessage && /* @__PURE__ */ jsx("div", { className: "p-4 text-center bg-green-50 border border-green-200", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-green-700 font-dmsans", children: "¡Gracias por contactarnos! Te responderemos pronto." }) })
  ] }) });
};
function useSteps(totalSteps = 1) {
  const [currentStep, setCurrentStep] = useState(0);
  const next = () => {
    console.log("Going next from step", currentStep);
    setCurrentStep((prev) => prev < totalSteps - 1 ? prev + 1 : prev);
  };
  const back = () => {
    console.log("Going back from step", currentStep);
    setCurrentStep((prev) => prev > 0 ? prev - 1 : prev);
  };
  const reset = () => {
    console.log("Resetting steps to 0");
    setCurrentStep(0);
  };
  return {
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    next,
    back,
    reset
  };
}
const MultiStep = ({ citations, lawyers }) => {
  const { currentStep, next, back } = useSteps(3);
  const [citationId, setCitationId] = useState(null);
  const [formData, setFormData] = useState(null);
  const handleFormSuccess = (values, savedCitationId) => {
    setFormData(values);
    setCitationId(savedCitationId);
    next();
  };
  const getSelectedLawyer = () => {
    if (!formData || !formData.lawyer_id) return null;
    if (formData.lawyer_id === "cualquiera") return { name: "Cualquiera" };
    return lawyers.find((lawyer) => lawyer.id == formData.lawyer_id);
  };
  const handleCalendarSuccess = () => {
    next();
  };
  return /* @__PURE__ */ jsxs("section", { className: "w-full h-full max-w-3xl", children: [
    currentStep === 0 && /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(ContactForm, { lawyers, onSuccess: handleFormSuccess }) }),
    currentStep === 1 && /* @__PURE__ */ jsx(
      Calendar,
      {
        citations,
        back,
        citationId,
        onSuccess: handleCalendarSuccess,
        selectedLawyerId: formData?.lawyer_id
      }
    ),
    currentStep === 2 && /* @__PURE__ */ jsx(ConfirmationStep, { formData, selectedLawyer: getSelectedLawyer() })
  ] });
};
const ConfirmationStep = ({ formData, selectedLawyer }) => {
  return /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
    /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-medium text-darki font-prata", children: "¡Gracias por tu reserva!" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-lg text-greyki font-dmsans", children: "Estaremos contactando contigo pronto" }),
    formData && /* @__PURE__ */ jsxs("div", { className: "p-6 text-left border bg-whiteki border-softGrey", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3 font-medium text-darki font-dmsans", children: "Datos de tu reserva:" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-greyki font-dmsans", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Nombre:" }),
          " ",
          formData.name
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Email:" }),
          " ",
          formData.email
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Teléfono:" }),
          " ",
          formData.phone
        ] }),
        selectedLawyer && /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Abogado seleccionado:" }),
          " ",
          selectedLawyer.name
        ] }),
        formData.observations && /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Observaciones:" }),
          " ",
          formData.observations
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.location.href = "/",
        className: "px-8 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki font-dmsans",
        children: "Volver al Inicio"
      }
    ) })
  ] }) });
};
const Calendar = ({ citations = null, back = null, citationId = null, onSuccess = null, selectedLawyerId = null }) => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [tempSelectedSlot, setTempSelectedSlot] = useState(null);
  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.start;
    const end = selectInfo.end;
    const now = /* @__PURE__ */ new Date();
    if (start < now) {
      alert("No puede seleccionar fechas en el pasado. Por favor seleccione una fecha actual o futura.");
      return;
    }
    const hasConflict = events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return start < eventEnd && end > eventStart;
    });
    if (hasConflict) {
      alert("Este horario no está disponible. Por favor seleccione otro horario.");
      return;
    }
    const newSelectedSlot = {
      start,
      end,
      startString: start.toLocaleString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      endString: end.toLocaleString("es-CO", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };
    setSelectedSlot(newSelectedSlot);
    const highlightEvent = {
      id: "temp-selection",
      title: "Horario Seleccionado",
      start: start.toISOString(),
      end: end.toISOString(),
      backgroundColor: "#d4af37",
      // Golden color
      borderColor: "#b8941f",
      textColor: "#ffffff",
      classNames: ["selected-slot"]
    };
    setTempSelectedSlot(highlightEvent);
    setEvents((prev) => [...prev.filter((e) => e.id !== "temp-selection"), highlightEvent]);
    setTimeout(() => {
      const confirmationElement = document.getElementById("confirmation-section");
      if (confirmationElement) {
        confirmationElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };
  const confirmReservation = async () => {
    if (!selectedSlot || !citationId) return;
    setIsConfirming(true);
    try {
      const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };
      const response = await axios.post("/contacto/complete-reservation", {
        citation_id: citationId,
        starts_at: formatDateTime(selectedSlot.start),
        ends_at: formatDateTime(selectedSlot.end)
      });
      if (response.data.success) {
        console.log("Reservation completed:", response.data);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error completing reservation:", error);
      alert("Error al completar la reserva. Por favor intente nuevamente.");
    } finally {
      setIsConfirming(false);
    }
  };
  const cancelSelection = () => {
    setSelectedSlot(null);
    setTempSelectedSlot(null);
    setEvents((prev) => prev.filter((e) => e.id !== "temp-selection"));
  };
  useEffect(() => {
    if (citations) {
      let validCitations = citations.filter((c) => c.starts_at && c.ends_at);
      if (selectedLawyerId && selectedLawyerId !== "cualquiera") {
        validCitations = validCitations.filter((c) => c.lawyer_id == selectedLawyerId);
      }
      const mapped = validCitations.map((c, index) => {
        const isBlocked = c.is_blocked === true;
        const lawyerName = c.lawyer ? c.lawyer.name : null;
        return {
          id: `slot-${index}`,
          title: isBlocked ? `${lawyerName ?? "Abogado"} - No disponible` : `${lawyerName ?? "Cualquiera"} - Ocupado`,
          start: c.starts_at.replace(" ", "T"),
          end: c.ends_at.replace(" ", "T"),
          backgroundColor: isBlocked ? "#dc2626" : "#000000",
          borderColor: isBlocked ? "#b91c1c" : "#000000",
          classNames: [isBlocked ? "blocked-slot" : "occupied-slot"],
          textColor: "#ffffff",
          extendedProps: {
            isBlocked,
            lawyerId: c.lawyer ? c.lawyer.id : null
          }
        };
      });
      setEvents(mapped);
    }
    return () => false;
  }, [citations, selectedLawyerId]);
  return /* @__PURE__ */ jsx(Fragment, { children: citations ? /* @__PURE__ */ jsxs("div", { className: "mx-auto font-bold tracking-normal text-[13px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 mb-6 border bg-golden/10 border-golden", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 font-medium text-darki font-dmsans", children: "Instrucciones:" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-greyki font-dmsans", children: "Haga clic y arrastre en el calendario para seleccionar su horario preferido. Los espacios en negro están ocupados y los espacios en rojo no están disponibles." })
    ] }),
    /* @__PURE__ */ jsx(
      FullCalendar,
      {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        headerToolbar: {
          center: "prev,next today",
          left: "title",
          right: "timeGridWeek,timeGridDay"
        },
        slotMinTime: "09:00:00",
        slotMaxTime: "18:00:00",
        weekends: false,
        events,
        height: "auto",
        locale: esLocale,
        selectable: true,
        selectMirror: true,
        select: handleDateSelect,
        slotDuration: "00:30:00",
        slotLabelInterval: "00:30:00",
        allDaySlot: false,
        slotLabelFormat: {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        },
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5],
          // Monday - Friday
          startTime: "09:00",
          endTime: "18:00"
        },
        selectConstraint: "businessHours",
        validRange: {
          start: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
          // Only allow dates from today onwards
        },
        dayCellClassNames: () => "available-slot",
        selectOverlap: false,
        eventOverlap: false
      }
    ),
    selectedSlot && /* @__PURE__ */ jsxs("div", { className: "p-6 mt-6 bg-white border shadow-lg border-softGrey", children: [
      /* @__PURE__ */ jsx("h3", { id: "confirmation-section", className: "mb-4 text-lg font-medium text-darki font-dmsans", children: "Confirmar Reserva" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: /* @__PURE__ */ jsx("strong", { children: "Fecha y hora seleccionada:" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-darki font-dmsans", children: selectedSlot.startString }),
        /* @__PURE__ */ jsxs("p", { className: "text-greyki font-dmsans", children: [
          /* @__PURE__ */ jsx("strong", { children: "Hasta:" }),
          " ",
          selectedSlot.endString
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: confirmReservation,
            disabled: isConfirming,
            className: "px-6 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki disabled:bg-graykiSecondary font-dmsans",
            children: isConfirming ? "Confirmando..." : "Confirmar Reserva"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: cancelSelection,
            disabled: isConfirming,
            className: "px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans",
            children: "Cancelar"
          }
        )
      ] })
    ] }),
    back && /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: back,
        className: "px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans",
        children: "Volver"
      }
    ) })
  ] }) : /* @__PURE__ */ jsx("p", { className: "py-8 text-center text-greyki font-dmsans", children: "No hay citas disponibles" }) });
};
function JsonLd({ data }) {
  if (!data) return null;
  return /* @__PURE__ */ jsx(Head_default, { children: /* @__PURE__ */ jsx(
    "script",
    {
      type: "application/ld+json",
      dangerouslySetInnerHTML: { __html: JSON.stringify(data) }
    },
    "json-ld"
  ) });
}
const About = ({ lawyers, seo }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx(
      BannerInformative,
      {
        picture: "/images/shared/background-title.webp",
        title: "Nosotros",
        description: "Conoce más sobre nuestra historia, misión y visión"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("main", { className: "max-w-6xl px-4 py-12 mx-auto lg:px-6 lg:py-16", children: [
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("section", { className: "mb-12 lg:mb-16", children: /* @__PURE__ */ jsx("div", { className: "bg-white border-0 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 lg:p-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-6 lg:mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1 h-8 bg-[#C59B40] mr-4 lg:h-12 lg:mr-6" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold font-prata md:text-3xl lg:text-4xl", children: "Misión" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 leading-relaxed prose prose-lg max-w-none lg:space-y-6", children: [
          /* @__PURE__ */ jsx("p", { children: "En Inmobiliaria Vergara y Abogados, nos enorgullece ser el aliado estratégico de nuestros clientes en la compra y venta de inmuebles, brindando asesoría legal especializada, garantizando transacciones seguras y confiables a través de un equipo de profesionales altamente capacitados. Combinamos la experiencia inmobiliaria con el respaldo jurídico, ofreciendo un servicio personalizado que se adapta a las necesidades específicas de cada cliente." }),
          /* @__PURE__ */ jsx("p", { children: "Actuamos con ética, responsabilidad y compromiso en cada paso, fortaleciendo la seguridad jurídica en cada proceso y contribuyendo al desarrollo patrimonial de quienes confían en nosotros. En nuestra empresa, trabajamos para que cada decisión, grande o pequeña, sea respaldada por confianza y seguridad." })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("section", { className: "mb-12 lg:mb-16", children: /* @__PURE__ */ jsx("div", { className: "bg-white border-0 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 lg:p-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-6 lg:mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1 h-8 bg-[#C59B40] mr-4 lg:h-12 lg:mr-6" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold font-prata md:text-3xl lg:text-4xl", children: "Vision" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 leading-relaxed prose prose-lg max-w-none lg:space-y-6", children: [
          /* @__PURE__ */ jsx("p", { children: "Ser una empresa líder y referente en el sector inmobiliario y jurídico, destacada por la calidad de nuestros servicios, la transparencia en nuestras operaciones y el firme compromiso con nuestros clientes. Aspiramos a expandir nuestra presencia en todo el territorio nacional y consolidarnos como una firma innovadora que combine la experiencia en bienes raíces con el respaldo legal, ofreciendo soluciones efectivas, seguras y adaptadas a las necesidades de cada cliente." }),
          /* @__PURE__ */ jsx("p", { children: "Nos proyectamos como un equipo en constante evolución, que se adapta al dinamismo del mercado, integrando nuevas tecnologías para mejorar la experiencia de quienes buscan asesoría inmobiliaria y jurídica de confianza. Nuestro objetivo es seguir creciendo y ser siempre un aliado confiable y especializado para nuestros clientes." })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("section", { className: "mb-12 lg:mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center lg:mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-bold font-prata md:text-3xl lg:text-4xl", children: "Nuestros Valores" }),
          /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-[#C59B40] mx-auto lg:w-24" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8", children: [
          /* @__PURE__ */ jsx("div", { className: "transition-shadow bg-white border-0 shadow-lg hover:shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center lg:p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white lg:w-8 lg:h-8", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                d: "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                clipRule: "evenodd"
              }
            ) }) }),
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-bold lg:text-xl", children: "Confianza" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 lg:text-base", children: "Construimos relaciones duraderas basadas en la confianza mutua, la transparencia y el compromiso con nuestros clientes." })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "transition-shadow bg-white border-0 shadow-lg hover:shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center lg:p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white lg:w-8 lg:h-8", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                d: "M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z",
                clipRule: "evenodd"
              }
            ) }) }),
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-bold lg:text-xl", children: "Excelencia" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 lg:text-base", children: "Buscamos la excelencia en cada servicio que ofrecemos, manteniendo los más altos estándares de calidad y profesionalismo." })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "transition-shadow bg-white border-0 shadow-lg hover:shadow-xl md:col-span-2 lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center lg:p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#C59B40] rounded-full flex items-center justify-center mx-auto mb-4 lg:w-16 lg:h-16 lg:mb-6", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-white lg:w-8 lg:h-8", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                d: "M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
                clipRule: "evenodd"
              }
            ) }) }),
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-bold lg:text-xl", children: "Integridad" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 lg:text-base", children: "Actuamos con honestidad, ética y responsabilidad en todas nuestras operaciones y relaciones comerciales." })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("section", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-[#C59B40] rounded-lg lg:p-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-bold text-white font-prata md:text-3xl lg:text-4xl", children: "¿Listo para trabajar con nosotros?" }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-white lg:mb-8 lg:text-lg", children: "Contáctanos hoy mismo para recibir la mejor asesoría inmobiliaria y legal." }),
        /* @__PURE__ */ jsx(MainButton, { as: Link_default, href: "/contacto", className: "bg-white text-[#C59B40] hover:bg-gray-100", children: "Contactar Ahora" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(LawyersSection, { lawyers })
  ] });
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
function BlogIndex({ blogs, filters, seo }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFeatured, setShowFeatured] = useState(filters.featured === "true");
  const handleSearch = (e) => {
    e.preventDefault();
    router3.get("/blog", {
      search: searchTerm || void 0,
      featured: showFeatured ? "true" : void 0
    }, { preserveState: true });
  };
  const clearFilters = () => {
    setSearchTerm("");
    setShowFeatured(false);
    router3.get("/blog", {}, { preserveState: true });
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx(
      BannerInformative,
      {
        picture: "/images/shared/background-title.webp",
        title: "Blog",
        description: "Artículos, noticias y consejos sobre bienes raíces y derecho inmobiliario"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-whiteki", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-8 mx-auto max-w-7xl lg:py-12", children: [
      /* @__PURE__ */ jsx("section", { className: "mb-8 lg:mb-12", children: /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "p-6 shadow-lg lg:p-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3", children: "Buscar artículos" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-greyki lg:w-5 lg:h-5" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                placeholder: "Buscar por título, contenido...",
                className: "w-full py-2 pl-10 pr-4 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:py-3 lg:pl-12"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: showFeatured,
              onChange: (e) => setShowFeatured(e.target.checked),
              className: "w-4 h-4 mr-2 transition-colors duration-200 border-2 border-golden text-golden focus:ring-golden focus:ring-2 lg:w-5 lg:h-5 lg:mr-3"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-darki font-dmsans", children: "Solo destacados" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:gap-3", children: [
          /* @__PURE__ */ jsxs(MainButton, { type: "submit", className: "px-6 py-2 lg:px-8 lg:py-3", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 mr-2" }),
            "Buscar"
          ] }),
          (searchTerm || showFeatured) && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: clearFilters,
              className: "px-4 py-2 transition-colors duration-200 border text-greyki hover:text-darki font-dmsans border-graykiSecondary hover:border-darki lg:px-6 lg:py-3",
              children: "Limpiar"
            }
          )
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx("section", { children: blogs.data.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:gap-8 lg:grid-cols-3", children: blogs.data.map((blog) => /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("article", { className: "bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: blog.featured_image ? `/storage/${blog.featured_image}` : "/placeholder.svg",
                alt: blog.title,
                className: "object-cover w-full h-40 sm:h-48"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 lg:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium line-clamp-2 text-darki font-prata lg:mb-3 lg:text-xl", children: blog.title }),
            /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm text-greyki line-clamp-3 font-dmsans lg:mb-4 lg:text-base", children: blog.excerpt }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 text-xs text-greyki lg:mb-4 lg:text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(User, { className: "w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" }),
                /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: blog.user.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" }),
                /* @__PURE__ */ jsxs("span", { className: "font-dmsans", children: [
                  blog.reading_time,
                  " min"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-greyki lg:text-sm", children: [
                /* @__PURE__ */ jsx(Calendar$1, { className: "w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" }),
                /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: formatDate(blog.published_at) })
              ] }),
              /* @__PURE__ */ jsxs(
                Link_default,
                {
                  href: `/blog/${blog.slug}`,
                  className: "inline-flex items-center px-3 py-1 text-xs transition-colors duration-200 bg-golden text-whiteki hover:bg-darki font-dmsans lg:px-4 lg:py-2 lg:text-sm",
                  children: [
                    "Leer más",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 ml-1 lg:w-4 lg:h-4 lg:ml-2" })
                  ]
                }
              )
            ] })
          ] })
        ] }) }, blog.id)) }),
        blogs.last_page > 1 && /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 mt-8 lg:flex-row lg:gap-3 lg:mt-12", children: [
          blogs.prev_page_url && /* @__PURE__ */ jsx(
            Link_default,
            {
              href: blogs.prev_page_url,
              className: "px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3",
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1 lg:gap-2", children: Array.from({ length: blogs.last_page }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
            Link_default,
            {
              href: `/blog?page=${page}`,
              className: `min-w-[36px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 ${blogs.current_page === page ? "bg-golden text-whiteki shadow-lg scale-110" : "border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki"}`,
              children: page
            },
            page
          )) }),
          blogs.next_page_url && /* @__PURE__ */ jsx(
            Link_default,
            {
              href: blogs.next_page_url,
              className: "px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3",
              children: "Siguiente"
            }
          )
        ] }) })
      ] }) : /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "py-12 text-center lg:py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xl font-medium text-darki font-prata lg:text-2xl", children: "No se encontraron artículos" }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg", children: "No hay artículos que coincidan con tus criterios de búsqueda" }),
        /* @__PURE__ */ jsx(MainButton, { onClick: clearFilters, className: "px-6 py-3 m-auto shadow-lg lg:px-8 lg:py-4", children: "Ver todos los artículos" })
      ] }) }) }) })
    ] }) })
  ] });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogIndex
}, Symbol.toStringTag, { value: "Module" }));
function BlogShow({ blog, relatedBlogs, seo }) {
  const { props } = usePage();
  const canonical = props.canonicalUrl || "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt || "",
    "url": canonical,
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "image": blog.featured_image ? `/storage/${blog.featured_image}` : void 0,
    "author": {
      "@type": "Person",
      "name": blog.user?.name || "Inmobiliaria Vergara y Abogados"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Inmobiliaria Vergara y Abogados",
      "logo": { "@type": "ImageObject", "url": "/logo.png" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical }
  };
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatContent = (content) => ({
    __html: typeof window !== "undefined" ? DOMPurify.sanitize(content ?? "") : content ?? ""
  });
  const shareUrl = window.location.href;
  const shareTitle = blog.title;
  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(JsonLd, { data: articleSchema }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-whiteki", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white border-b border-softGrey", children: /* @__PURE__ */ jsx("div", { className: "px-4 py-4 mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: "/blog",
          className: "inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2 lg:w-5 lg:h-5" }),
            "Volver al Blog"
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxs("article", { className: "px-4 py-8 mx-auto max-w-4xl lg:py-12", children: [
        /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("header", { className: "mb-8 text-center lg:mb-12", children: [
          /* @__PURE__ */ jsx("h1", { className: "mb-4 text-2xl font-bold leading-tight text-darki font-prata sm:text-3xl md:text-4xl lg:text-5xl", children: blog.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 mb-6 text-greyki sm:flex-row sm:gap-6 lg:mb-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(User, { className: "w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-dmsans lg:text-base", children: blog.user.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(Calendar$1, { className: "w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-dmsans lg:text-base", children: formatDate(blog.published_at) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-dmsans lg:text-base", children: [
                blog.reading_time,
                " min de lectura"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-darki font-dmsans", children: "Compartir:" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2 lg:gap-3", children: socialLinks.map((social) => {
              const Icon = social.icon;
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: social.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center justify-center w-8 h-8 transition-colors duration-200 border-2 border-golden text-golden hover:bg-golden hover:text-whiteki lg:w-10 lg:h-10",
                  "aria-label": `Compartir en ${social.name}`,
                  children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 lg:w-5 lg:h-5" })
                },
                social.name
              );
            }) })
          ] })
        ] }) }),
        blog.featured_image && /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "mb-8 lg:mb-12", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: `/storage/${blog.featured_image}`,
            alt: blog.title,
            className: "w-full h-48 object-cover rounded-lg sm:h-64 lg:h-80"
          }
        ) }) }),
        /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "prose prose-lg max-w-none", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-base leading-relaxed text-greyki font-dmsans lg:text-lg",
            dangerouslySetInnerHTML: formatContent(blog.content)
          }
        ) }) }),
        relatedBlogs && relatedBlogs.length > 0 && /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("section", { className: "mt-12 lg:mt-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-6 text-2xl font-bold text-darki font-prata lg:mb-8 lg:text-3xl", children: "Artículos Relacionados" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: relatedBlogs.map((relatedBlog) => /* @__PURE__ */ jsxs("article", { className: "bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: relatedBlog.featured_image ? `/storage/${relatedBlog.featured_image}` : "/placeholder.svg",
                  alt: relatedBlog.title,
                  className: "object-cover w-full h-40 sm:h-48"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 lg:p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium line-clamp-2 text-darki font-prata lg:mb-3 lg:text-xl", children: relatedBlog.title }),
              /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm text-greyki line-clamp-3 font-dmsans lg:mb-4 lg:text-base", children: relatedBlog.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-greyki lg:text-sm", children: [
                  /* @__PURE__ */ jsx(Calendar$1, { className: "w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" }),
                  /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: formatDate(relatedBlog.published_at) })
                ] }),
                /* @__PURE__ */ jsxs(
                  Link_default,
                  {
                    href: `/blog/${relatedBlog.slug}`,
                    className: "inline-flex items-center px-3 py-1 transition-colors duration-200 bg-golden text-whiteki hover:bg-darki font-dmsans text-xs lg:px-4 lg:py-2 lg:text-sm",
                    children: [
                      "Leer más",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3 ml-1 lg:w-4 lg:h-4 lg:ml-2" })
                    ]
                  }
                )
              ] })
            ] })
          ] }, relatedBlog.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "mt-12 text-center lg:mt-16", children: /* @__PURE__ */ jsx(MainButton, { as: Link_default, href: "/blog", className: "px-8 py-3 shadow-lg lg:px-10 lg:py-4", children: "Volver al Blog" }) }) })
      ] })
    ] })
  ] });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogShow
}, Symbol.toStringTag, { value: "Module" }));
const Contact = ({ citations, lawyers, seo, corporativeInfo = null }) => {
  const address = corporativeInfo?.office_address || "Cl. 12 #8 05,\nSoacha Cundinamarca,\nColombia";
  const phone = corporativeInfo?.corporative_whatsapp || "+1-258-987-000";
  const email = corporativeInfo?.corporative_email || "admin@inmobiliariavergarayabogados.com";
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("section", { className: "w-full py-16 lg:py-24", style: {
    backgroundImage: "url('/images/shared/service-background.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }, children: /* @__PURE__ */ jsx("div", { className: "px-4 mx-auto max-w-7xl lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full lg:col-span-2", children: /* @__PURE__ */ jsxs(MotionWrapper, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Escribe tu Mensaje" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-px bg-golden" }),
          /* @__PURE__ */ jsx("div", { className: "mx-4 text-golden", children: "//" }),
          /* @__PURE__ */ jsx("div", { className: "w-8 h-px bg-golden" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { id: "contact-form", children: /* @__PURE__ */ jsx(MultiStep, { citations, lawyers }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full lg:col-span-1", children: /* @__PURE__ */ jsxs(MotionWrapper, { delay: 0.2, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Ponte en Contacto con Nosotros" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-px bg-golden" }),
          /* @__PURE__ */ jsx("div", { className: "mx-4 text-golden", children: "//" }),
          /* @__PURE__ */ jsx("div", { className: "w-8 h-px bg-golden" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.1, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start p-4 space-x-3 bg-white border border-softGrey", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden", children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-1 text-lg font-bold text-darki font-prata", children: "Dirección" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-line text-greyki font-dmsans", children: address })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start p-4 space-x-3 bg-white border border-softGrey", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden", children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-1 text-lg font-bold text-darki font-prata", children: "Teléfono" }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-greyki font-dmsans", children: phone }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-greyki font-dmsans", children: email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start p-4 space-x-3 bg-white border border-softGrey", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-golden", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-1 text-lg font-bold text-darki font-prata", children: "Horario de Atención" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 text-xs text-greyki font-dmsans", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Lunes:" }),
                " 09:00-17:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Martes:" }),
                " 09:00-17:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Miércoles:" }),
                " 09:00-17:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Jueves:" }),
                " 09:00-17:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Viernes:" }),
                " 09:00-17:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Sábado:" }),
                " 10:00-13:00"
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Domingo:" }),
                " Cerrado"
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.4, children: /* @__PURE__ */ jsxs("div", { className: "p-4 mt-6 border bg-softGrey/30 border-softGrey", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-bold text-center text-darki font-prata", children: "¿Necesitas ayuda inmediata?" }),
        /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm text-center text-greyki font-dmsans", children: "Nuestro equipo está disponible para responder tus consultas y brindarte la mejor asesoría legal." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-greyki font-dmsans", children: /* @__PURE__ */ jsx("strong", { children: "Respuesta garantizada en menos de 24 horas" }) })
      ] }) })
    ] }) })
  ] }) }) }) });
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact
}, Symbol.toStringTag, { value: "Module" }));
const Home = ({ lawyers, homeBanner, seo }) => {
  const { props } = usePage();
  const info = props.corporativeInfo || {};
  const canonical = props.canonicalUrl || "";
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LegalService", "RealEstateAgent"],
    "name": "Inmobiliaria Vergara y Abogados",
    "description": "Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia. Servicios legales de compra, venta, arriendo y asesoría jurídica de propiedades.",
    "url": canonical,
    "logo": `${canonical}/logo.png`,
    "image": `${canonical}/logo.png`,
    "telephone": info.corporative_whatsapp || "",
    "email": info.corporative_email || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": info.office_address || "Cl. 12 #8 05",
      "addressLocality": "Soacha",
      "addressRegion": "Cundinamarca",
      "postalCode": "250001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.579,
      "longitude": -74.2172
    },
    "areaServed": [
      { "@type": "City", "name": "Soacha" },
      { "@type": "State", "name": "Cundinamarca" },
      { "@type": "Country", "name": "Colombia" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      info.corporative_facebook,
      info.corporative_instagram,
      info.corporative_linkedin,
      info.corporative_twitter
    ].filter(Boolean),
    "priceRange": "$$"
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(JsonLd, { data: localBusinessSchema }),
    /* @__PURE__ */ jsx(MainBanner, { homeBanner }),
    /* @__PURE__ */ jsx(LawyersSection, { lawyers })
  ] });
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
function LawyerDetail({ lawyer, seo }) {
  const { props } = usePage();
  const canonical = props.canonicalUrl || "";
  const attorneySchema = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "name": lawyer.name,
    "description": lawyer.description || `${lawyer.profession} especializado en derecho inmobiliario en Soacha, Cundinamarca.`,
    "url": canonical,
    "image": lawyer.image ? `/storage/${lawyer.image}` : void 0,
    "jobTitle": lawyer.profession,
    "worksFor": {
      "@type": "LegalService",
      "name": "Inmobiliaria Vergara y Abogados",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Soacha",
        "addressRegion": "Cundinamarca",
        "addressCountry": "CO"
      }
    },
    "alumniOf": (lawyer.education || []).map((e) => ({
      "@type": "EducationalOrganization",
      "name": e.institution || e.title || e
    })),
    "knowsAbout": lawyer.specializations || [],
    "sameAs": [
      lawyer.linkedin,
      lawyer.facebook,
      lawyer.twitter,
      lawyer.instagram
    ].filter(Boolean)
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-whiteki", children: [
    /* @__PURE__ */ jsx(JsonLd, { data: attorneySchema }),
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "bg-darki", children: /* @__PURE__ */ jsx("div", { className: "px-4 py-16 mx-auto max-w-7xl lg:py-24", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3 lg:gap-12", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden border-4 aspect-square border-golden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: lawyer.image ? `/storage/${lawyer.image}` : "/placeholder.svg",
          alt: lawyer.name,
          className: "object-cover w-full h-full"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-2 text-3xl font-bold text-whiteki font-prata lg:text-5xl", children: lawyer.name }),
        lawyer.title && /* @__PURE__ */ jsx("p", { className: "mb-4 text-xl text-golden font-dmsans lg:text-2xl", children: lawyer.title }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-lg text-graykiSecondary font-dmsans", children: lawyer.profession }),
        lawyer.description && /* @__PURE__ */ jsx("p", { className: "mb-8 text-base leading-relaxed text-whiteki font-dmsans lg:text-lg", children: lawyer.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 mb-8 sm:grid-cols-2", children: [
          lawyer.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-whiteki", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-golden" }),
            /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: lawyer.phone })
          ] }),
          lawyer.email && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-whiteki", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-golden" }),
            /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: lawyer.email })
          ] }),
          lawyer.office_location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-whiteki", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-golden" }),
            /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: lawyer.office_location })
          ] }),
          lawyer.office_hours && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-whiteki", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-golden" }),
            /* @__PURE__ */ jsx("span", { className: "font-dmsans", children: lawyer.office_hours })
          ] })
        ] }),
        (lawyer.linkedin || lawyer.facebook || lawyer.twitter || lawyer.instagram) && /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          lawyer.linkedin && /* @__PURE__ */ jsx("a", { href: lawyer.linkedin, target: "_blank", rel: "noopener noreferrer", className: "p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5" }) }),
          lawyer.facebook && /* @__PURE__ */ jsx("a", { href: lawyer.facebook, target: "_blank", rel: "noopener noreferrer", className: "p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki", children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5" }) }),
          lawyer.twitter && /* @__PURE__ */ jsx("a", { href: lawyer.twitter, target: "_blank", rel: "noopener noreferrer", className: "p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" }) }),
          lawyer.instagram && /* @__PURE__ */ jsx("a", { href: lawyer.instagram, target: "_blank", rel: "noopener noreferrer", className: "p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" }) })
        ] })
      ] })
    ] }) }) }) }),
    (lawyer.years_experience || lawyer.cases_won || lawyer.specializations?.length > 0) && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsx("div", { className: "px-4 py-12 bg-white lg:py-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [
      lawyer.years_experience && /* @__PURE__ */ jsxs("div", { className: "p-6 text-center border-2 border-golden lg:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl", children: [
          lawyer.years_experience,
          "+"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-lg text-darki font-dmsans", children: "Años de Experiencia" })
      ] }),
      lawyer.cases_won && /* @__PURE__ */ jsxs("div", { className: "p-6 text-center border-2 border-golden lg:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl", children: [
          lawyer.cases_won,
          "+"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-lg text-darki font-dmsans", children: "Casos Ganados" })
      ] }),
      lawyer.specializations && lawyer.specializations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-6 text-center border-2 border-golden lg:p-8 sm:col-span-2 lg:col-span-1", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl", children: lawyer.specializations.length }),
        /* @__PURE__ */ jsx("div", { className: "text-lg text-darki font-dmsans", children: "Especializaciones" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-12 mx-auto max-w-7xl lg:py-16", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-3 lg:gap-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        lawyer.bio && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.3, children: /* @__PURE__ */ jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-6 text-2xl font-bold text-darki font-prata lg:text-3xl", children: "Sobre Mí" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "prose prose-lg max-w-none text-greyki font-dmsans",
              dangerouslySetInnerHTML: {
                __html: typeof window !== "undefined" ? DOMPurify.sanitize(lawyer.bio ?? "") : lawyer.bio ?? ""
              }
            }
          )
        ] }) }),
        lawyer.education && lawyer.education.length > 0 && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.4, children: /* @__PURE__ */ jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-8 h-8 text-golden" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-darki font-prata lg:text-3xl", children: "Educación" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: lawyer.education.map((edu, index) => /* @__PURE__ */ jsxs("div", { className: "p-6 border-l-4 border-golden bg-softGrey", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-xl font-bold text-darki font-prata", children: edu.degree }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 text-lg text-golden font-dmsans", children: edu.institution }),
            edu.year && /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: edu.year })
          ] }, index)) })
        ] }) }),
        lawyer.experience && lawyer.experience.length > 0 && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.5, children: /* @__PURE__ */ jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-8 h-8 text-golden" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-darki font-prata lg:text-3xl", children: "Experiencia Profesional" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: lawyer.experience.map((exp, index) => /* @__PURE__ */ jsxs("div", { className: "p-6 border-l-4 border-golden bg-softGrey", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-xl font-bold text-darki font-prata", children: exp.position }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 text-lg text-golden font-dmsans", children: exp.company }),
            exp.period && /* @__PURE__ */ jsx("p", { className: "mb-3 text-greyki font-dmsans", children: exp.period }),
            exp.description && /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: exp.description })
          ] }, index)) })
        ] }) }),
        lawyer.achievements && lawyer.achievements.length > 0 && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.6, children: /* @__PURE__ */ jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(Award, { className: "w-8 h-8 text-golden" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-darki font-prata lg:text-3xl", children: "Logros y Reconocimientos" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: lawyer.achievements.map((achievement, index) => /* @__PURE__ */ jsx("div", { className: "p-6 bg-white border-2 border-golden", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-12 h-12 bg-golden", children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-1 text-lg font-bold text-darki font-prata", children: achievement.title }),
              achievement.year && /* @__PURE__ */ jsx("p", { className: "mb-2 text-golden font-dmsans", children: achievement.year }),
              achievement.description && /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: achievement.description })
            ] })
          ] }) }, index)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
        lawyer.specializations && lawyer.specializations.length > 0 && /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.7, children: /* @__PURE__ */ jsx("section", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white border-2 border-golden lg:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(Scale, { className: "w-6 h-6 text-golden" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-darki font-prata lg:text-2xl", children: "Áreas de Especialización" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: lawyer.specializations.map((spec, index) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-darki font-dmsans", children: spec.area }),
              spec.percentage && /* @__PURE__ */ jsxs("span", { className: "text-golden font-dmsans", children: [
                spec.percentage,
                "%"
              ] })
            ] }),
            spec.percentage && /* @__PURE__ */ jsx("div", { className: "w-full h-2 overflow-hidden bg-softGrey", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full transition-all duration-500 bg-golden",
                style: { width: `${spec.percentage}%` }
              }
            ) })
          ] }, index)) })
        ] }) }) }),
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.8, children: /* @__PURE__ */ jsxs("section", { className: "p-6 bg-darki lg:p-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-bold text-whiteki font-prata lg:text-2xl", children: "¿Necesitas Asesoría Legal?" }),
          /* @__PURE__ */ jsx("p", { className: "mb-6 text-graykiSecondary font-dmsans", children: "Agenda una consulta para discutir tu caso con nuestro equipo de expertos." }),
          /* @__PURE__ */ jsx(MainButton, { as: Link_default, href: "/contacto", className: "w-full", children: "Agendar Consulta" })
        ] }) })
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LawyerDetail
}, Symbol.toStringTag, { value: "Module" }));
const ITEMS_PER_PAGE = 6;
function Properties({ states, properties, municipalities, seo }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    municipality_id: "",
    state_id: "",
    minPrice: "",
    maxPrice: "",
    propertyType: ""
  });
  const propertyTypes = [...new Set(properties.map((p) => p.type))];
  const availableMunicipalities = useMemo(() => {
    if (!filters.state_id) return municipalities;
    return municipalities.filter((m) => m.state_id === parseInt(filters.state_id));
  }, [municipalities, filters.state_id]);
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesMunicipality = !filters.municipality_id || property.municipality_id === parseInt(filters.municipality_id);
      const matchesState = !filters.state_id || property.state_id === parseInt(filters.state_id);
      const matchesMinPrice = !filters.minPrice || property.price >= Number.parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= Number.parseInt(filters.maxPrice);
      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      return matchesMunicipality && matchesState && matchesMinPrice && matchesMaxPrice && matchesType;
    });
  }, [properties, filters]);
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset municipality when state changes
      ...key === "state_id" && { municipality_id: "" }
    }));
    setCurrentPage(1);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  const getStateName = (stateId) => {
    const state = states.find((s) => s.id === stateId);
    return state ? state.name : "";
  };
  const getMunicipalityName = (municipalityId) => {
    const municipality = municipalities.find((m) => m.id === municipalityId);
    return municipality ? municipality.name : "";
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("main", { className: "min-h-screen bg-whiteki", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-8 mx-auto max-w-7xl lg:py-12", children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "mb-6 lg:hidden", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsFiltersOpen(!isFiltersOpen),
        className: "flex items-center justify-between w-full p-4 text-left bg-white border shadow-lg border-softGrey",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Filter, { className: "w-5 h-5 text-golden" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-darki font-dmsans", children: "Filtros de Búsqueda" })
          ] }),
          isFiltersOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 lg:flex-row", children: [
      /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.1, children: /* @__PURE__ */ jsx("aside", { className: `lg:flex-shrink-0 lg:w-80 ${isFiltersOpen ? "block" : "hidden lg:block"}`, children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white border shadow-lg lg:sticky lg:top-4 border-softGrey lg:p-8", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-3 mb-6 text-lg font-medium text-darki font-dmsans lg:mb-8 lg:text-xl", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-5 h-5 text-golden lg:w-6 lg:h-6" }),
          "Filtros de Búsqueda"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 lg:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3", children: "Departamento" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.state_id,
                onChange: (e) => handleFilterChange("state_id", e.target.value),
                className: "w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todos los departamentos" }),
                  states.map((state) => /* @__PURE__ */ jsx("option", { value: state.id, children: state.name }, state.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3", children: "Municipio" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.municipality_id,
                onChange: (e) => handleFilterChange("municipality_id", e.target.value),
                disabled: !filters.state_id,
                className: "w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden disabled:bg-softGrey disabled:cursor-not-allowed font-dmsans lg:px-4 lg:py-3",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todos los municipios" }),
                  availableMunicipalities.map((municipality) => /* @__PURE__ */ jsx("option", { value: municipality.id, children: municipality.name }, municipality.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 lg:space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-darki font-dmsans", children: "Rango de Precio" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 lg:gap-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  placeholder: "Mínimo",
                  value: filters.minPrice,
                  onChange: (e) => handleFilterChange("minPrice", e.target.value),
                  className: "px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  placeholder: "Máximo",
                  value: filters.maxPrice,
                  onChange: (e) => handleFilterChange("maxPrice", e.target.value),
                  className: "px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3", children: "Tipo de Propiedad" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.propertyType,
                onChange: (e) => handleFilterChange("propertyType", e.target.value),
                className: "w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todos los tipos" }),
                  propertyTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type, children: type }, type))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 text-sm border-t border-softGrey text-greyki font-dmsans lg:pt-6", children: [
            "Mostrando ",
            filteredProperties.length,
            " propiedades"
          ] }),
          /* @__PURE__ */ jsx(
            MainButton,
            {
              onClick: () => {
                setFilters({
                  municipality_id: "",
                  state_id: "",
                  minPrice: "",
                  maxPrice: "",
                  propertyType: ""
                });
                setCurrentPage(1);
              },
              className: "w-full",
              children: "Limpiar Filtros"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("main", { className: "grid w-full grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:gap-8 lg:mb-12 xl:grid-cols-3", children: paginatedProperties.map((property, index) => /* @__PURE__ */ jsx(MotionWrapper, { delay: index * 0.1, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: property.thumbnail ? `/storage/${property.thumbnail}` : "/placeholder.svg",
                alt: property.name,
                className: "object-cover w-full h-48 sm:h-56"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "absolute px-2 py-1 text-xs font-medium shadow-lg top-3 right-3 bg-golden text-whiteki font-dmsans lg:top-4 lg:right-4 lg:px-3 lg:py-1", children: property.type_spanish }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-grow p-4 lg:p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium leading-tight text-darki font-dmsans lg:mb-3 lg:text-xl", children: property.name }),
            /* @__PURE__ */ jsx("p", { className: "mb-3 text-xl font-bold text-golden font-prata lg:mb-4 lg:text-2xl", children: formatPrice(property.price) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3 text-greyki lg:mb-4", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-dmsans lg:text-sm", children: [
                getMunicipalityName(property.municipality_id),
                ", ",
                getStateName(property.state_id)
              ] })
            ] }),
            property.size && /* @__PURE__ */ jsxs("div", { className: "mb-3 text-xs text-greyki font-dmsans lg:mb-4 lg:text-sm", children: [
              /* @__PURE__ */ jsx("strong", { children: "Área:" }),
              " ",
              property.size,
              " m²"
            ] }),
            property.description && /* @__PURE__ */ jsx("p", { className: "flex-grow mb-4 text-xs leading-relaxed text-greyki line-clamp-3 font-dmsans lg:mb-6 lg:text-sm", children: property.description })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-4 pb-4 mt-auto lg:px-6 lg:pb-6", children: /* @__PURE__ */ jsx(MainButton, { as: Link_default, href: `/inmobiliaria/${property.id}`, className: "w-full", children: "Ver Detalles" }) })
        ] }) }, property.id)) }),
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.3, children: totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-3", children: [
          /* @__PURE__ */ jsx(
            MainButton,
            {
              onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
              disabled: currentPage === 1,
              className: "px-4 py-2 text-sm disabled:bg-softGrey disabled:cursor-not-allowed lg:px-5 lg:py-3",
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1 lg:gap-2", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage(page),
              className: `min-w-[40px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 ${currentPage === page ? "bg-darki text-whiteki shadow-lg scale-110" : "border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki"}`,
              children: page
            },
            page
          )) }),
          /* @__PURE__ */ jsx(
            MainButton,
            {
              onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
              disabled: currentPage === totalPages,
              className: "px-4 py-2 text-sm disabled:bg-softGrey disabled:cursor-not-allowed lg:px-5 lg:py-3",
              children: "Siguiente"
            }
          )
        ] }) }),
        filteredProperties.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full px-4 text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xl font-medium text-darki font-prata lg:text-2xl", children: "No se encontraron propiedades" }),
          /* @__PURE__ */ jsx("p", { className: "mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg", children: "No hay propiedades que coincidan con tus criterios de búsqueda" }),
          /* @__PURE__ */ jsx(
            MainButton,
            {
              onClick: () => {
                setFilters({
                  municipality_id: "",
                  state_id: "",
                  minPrice: "",
                  maxPrice: "",
                  propertyType: ""
                });
                setCurrentPage(1);
              },
              className: "px-6 py-3 m-auto shadow-lg lg:px-8 lg:py-4",
              children: "Limpiar Todos los Filtros"
            }
          )
        ] })
      ] }) })
    ] })
  ] }) }) });
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Properties
}, Symbol.toStringTag, { value: "Module" }));
function VisitForm({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visit_date: "",
    visit_time: "",
    observations: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  if (!isOpen) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!formData.visit_date) newErrors.visit_date = "La fecha es requerida";
    if (!formData.visit_time) newErrors.visit_time = "La hora es requerida";
    const selectedDate = /* @__PURE__ */ new Date(formData.visit_date + "T" + formData.visit_time);
    const now = /* @__PURE__ */ new Date();
    if (selectedDate < now) {
      newErrors.visit_date = "La fecha y hora deben ser futuras";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/inmobiliaria/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
        },
        body: JSON.stringify({
          ...formData,
          property_id: property.id
        })
      });
      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            visit_date: "",
            visit_time: "",
            observations: ""
          });
          onClose();
        }, 3e3);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || "Error al procesar la solicitud" });
        }
      }
    } catch (error) {
      setErrors({ general: "Error de conexión. Intente nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
          onClick: onClose
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-md p-8 mx-4 text-center bg-white shadow-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }) }),
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-medium text-darki font-prata", children: "¡Visita Agendada!" }),
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-lg text-greyki font-dmsans", children: "Nos contactaremos contigo pronto para confirmar los detalles." }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 text-left border rounded bg-softGrey/20 border-softGrey", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 font-medium text-darki font-dmsans", children: "Detalles de tu visita:" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-greyki font-dmsans", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Propiedad:" }),
              " ",
              property.name
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Fecha:" }),
              " ",
              new Date(formData.visit_date).toLocaleDateString("es-CO")
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Hora:" }),
              " ",
              formData.visit_time
            ] })
          ] })
        ] })
      ] })
    ] });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-white shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-softGrey", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-darki font-prata", children: "Agendar Visita" }),
          /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: property.name })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 transition-colors duration-200 rounded text-greyki hover:text-darki hover:bg-softGrey",
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-80px)]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        errors.general && /* @__PURE__ */ jsx("div", { className: "p-4 text-red-600 border border-red-200 rounded bg-red-50", children: errors.general }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-lg font-medium text-darki font-dmsans", children: [
            /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-golden" }),
            "Información Personal"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Nombre completo *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "name",
                  value: formData.name,
                  onChange: handleChange,
                  className: `w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${errors.name ? "border-red-300 focus:border-red-300" : "border-graykiSecondary focus:border-golden"}`,
                  placeholder: "Tu nombre completo"
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Teléfono *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  name: "phone",
                  value: formData.phone,
                  onChange: handleChange,
                  className: `w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${errors.phone ? "border-red-300 focus:border-red-300" : "border-graykiSecondary focus:border-golden"}`,
                  placeholder: "+57 300 123 4567"
                }
              ),
              errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phone })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Correo electrónico *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                className: `w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${errors.email ? "border-red-300 focus:border-red-300" : "border-graykiSecondary focus:border-golden"}`,
                placeholder: "tu@email.com"
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-lg font-medium text-darki font-dmsans", children: [
            /* @__PURE__ */ jsx(Calendar$1, { className: "w-5 h-5 text-golden" }),
            "Información de la Visita"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Fecha preferida *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  name: "visit_date",
                  value: formData.visit_date,
                  onChange: handleChange,
                  min: today,
                  className: `w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${errors.visit_date ? "border-red-300 focus:border-red-300" : "border-graykiSecondary focus:border-golden"}`
                }
              ),
              errors.visit_date && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.visit_date })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Hora preferida *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "time",
                  name: "visit_time",
                  value: formData.visit_time,
                  onChange: handleChange,
                  className: `w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${errors.visit_time ? "border-red-300 focus:border-red-300" : "border-graykiSecondary focus:border-golden"}`
                }
              ),
              errors.visit_time && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.visit_time })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-darki font-dmsans", children: "Observaciones adicionales" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                name: "observations",
                value: formData.observations,
                onChange: handleChange,
                rows: 3,
                className: "w-full px-4 py-3 transition-all duration-200 border resize-none border-graykiSecondary font-dmsans focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden",
                placeholder: "¿Hay algo específico que te gustaría saber sobre la propiedad?"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pt-6 border-t sm:flex-row border-softGrey", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "flex-1 px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-greyki hover:bg-softGrey font-dmsans",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            MainButton,
            {
              type: "submit",
              disabled: isSubmitting,
              className: `flex-1 py-3 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`,
              children: isSubmitting ? "Enviando..." : "Agendar Visita"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
function PropertyDetail({ property, auth, seo }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  const images = [
    property.thumbnail ? `/storage/${property.thumbnail}` : "/placeholder.svg",
    ...property.gallery ? property.gallery.map((img) => `/storage/${img}`) : []
  ];
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleWhatsAppClick = (message) => {
    const phoneNumber = "+573115327297";
    const formattedNumber = phoneNumber.replace(/[\+\s\-\(\)]/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-whiteki", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-4 mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs(
      Link_default,
      {
        href: "/inmobiliaria",
        className: "inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2 lg:w-5 lg:h-5" }),
          "Volver a Propiedades"
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-6 mx-auto max-w-7xl lg:py-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: images[selectedImageIndex],
              alt: property.name,
              className: "w-full h-64 object-cover border border-softGrey cursor-pointer sm:h-80 lg:h-[500px]",
              onClick: () => setIsGalleryOpen(true)
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsGalleryOpen(true),
              className: "absolute flex items-center gap-2 px-2 py-1 text-xs transition-colors duration-200 top-3 right-3 bg-darki text-whiteki font-dmsans hover:bg-golden lg:top-4 lg:right-4 lg:px-3 lg:py-2 lg:text-sm",
              children: [
                /* @__PURE__ */ jsx(Maximize, { className: "w-3 h-3 lg:w-4 lg:h-4" }),
                "Ver Galería"
              ]
            }
          ),
          images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: prevImage,
                className: "absolute p-1 transition-colors duration-200 transform -translate-y-1/2 left-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-4 lg:p-2",
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 lg:w-5 lg:h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: nextImage,
                className: "absolute p-1 transition-colors duration-200 transform -translate-y-1/2 right-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-4 lg:p-2",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 lg:w-5 lg:h-5" })
              }
            )
          ] })
        ] }),
        images.length > 1 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: images.map((image, index) => /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: `${property.name} - ${index + 1}`,
            className: `w-full h-16 object-cover cursor-pointer border-2 transition-all duration-200 sm:h-20 lg:h-20 ${selectedImageIndex === index ? "border-golden" : "border-softGrey hover:border-golden"}`,
            onClick: () => setSelectedImageIndex(index)
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "px-3 py-1 text-sm font-medium bg-golden text-whiteki font-dmsans w-fit", children: property.type_spanish }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-golden font-prata sm:text-3xl", children: formatPrice(property.price) })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mb-3 text-2xl font-medium text-darki font-prata sm:text-3xl lg:text-4xl", children: property.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4 text-greyki lg:mb-6", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-dmsans lg:text-base", children: [
              property.municipality?.name,
              ", ",
              property.state?.name || "Colombia"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 py-4 border-y border-softGrey sm:gap-6 sm:py-6", children: [
          property.size && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(Home$1, { className: "w-5 h-5 text-golden lg:w-6 lg:h-6" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-darki font-prata lg:text-2xl", children: property.size }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-greyki font-dmsans lg:text-sm", children: "m² construidos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(Calendar$1, { className: "w-5 h-5 text-golden lg:w-6 lg:h-6" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-darki font-prata lg:text-2xl", children: "Disponible" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-greyki font-dmsans lg:text-sm", children: "Para visita" })
          ] })
        ] }),
        property.description && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-medium text-darki font-dmsans lg:mb-4 lg:text-xl", children: "Descripción" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-greyki font-dmsans lg:text-base", children: property.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 space-y-4 border-t border-softGrey lg:pt-6", children: [
          /* @__PURE__ */ jsx(
            MainButton,
            {
              onClick: () => setIsVisitFormOpen(true),
              className: "w-full py-3 text-base lg:py-4 lg:text-lg",
              children: "Agendar Visita"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleWhatsAppClick(`¡Hola! Me interesa obtener más información sobre la propiedad "${property.name}" (${formatPrice(property.price)}). ¿Podrían ayudarme con más detalles?`),
                className: "px-4 py-2 text-sm font-medium transition-all duration-300 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-6 lg:py-3 lg:text-base",
                children: "Solicitar Información"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleWhatsAppClick(`¡Hola! Me interesa contactar con un asesor para la propiedad "${property.name}" (${formatPrice(property.price)}). ¿Podrían ayudarme?`),
                className: "px-4 py-2 text-sm font-medium transition-all duration-300 border border-darki text-darki hover:bg-darki hover:text-whiteki font-dmsans lg:px-6 lg:py-3 lg:text-base",
                children: "Contactar Asesor"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    isGalleryOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90", children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center w-full h-full p-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsGalleryOpen(false),
          className: "absolute z-10 p-2 transition-colors duration-200 top-4 right-4 bg-darki text-whiteki hover:bg-golden lg:top-6 lg:right-6 lg:p-3",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 lg:w-6 lg:h-6" })
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: images[selectedImageIndex],
          alt: property.name,
          className: "object-contain max-w-full max-h-full"
        }
      ),
      images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: prevImage,
            className: "absolute p-2 transition-colors duration-200 transform -translate-y-1/2 left-4 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-8 lg:p-3",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-6 h-6 lg:w-8 lg:h-8" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: nextImage,
            className: "absolute p-2 transition-colors duration-200 transform -translate-y-1/2 right-4 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-8 lg:p-3",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-6 h-6 lg:w-8 lg:h-8" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute px-4 py-2 text-sm text-white transform -translate-x-1/2 rounded-lg bottom-4 left-1/2 bg-darki/80 lg:bottom-8 lg:text-base", children: [
        selectedImageIndex + 1,
        " / ",
        images.length
      ] })
    ] }) }),
    isVisitFormOpen && /* @__PURE__ */ jsx(
      VisitForm,
      {
        property,
        isOpen: isVisitFormOpen,
        onClose: () => setIsVisitFormOpen(false)
      }
    )
  ] }) });
}
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PropertyDetail
}, Symbol.toStringTag, { value: "Module" }));
const serviceIcons = [
  Scale,
  Home$1,
  FileText,
  Users,
  Shield,
  Building,
  Gavel,
  Handshake,
  Briefcase,
  Landmark,
  FileCheck,
  UserCheck,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar$1,
  Clock,
  CheckCircle,
  Star,
  Award,
  Target,
  Zap
];
const getServiceIcon = (serviceId) => {
  const iconIndex = serviceId % serviceIcons.length;
  return serviceIcons[iconIndex];
};
const ServiceDetail = ({ service, lawyers, seo }) => {
  getServiceIcon(service.id);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  const handleContactClick = (e) => {
    e.preventDefault();
    window.location.href = "/contacto";
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx(
      BannerInformative,
      {
        picture: "/images/shared/bg-services.webp",
        title: service.name,
        description: service.description || `Servicio especializado en ${service.category}`
      }
    ) }),
    /* @__PURE__ */ jsx("section", { className: "w-full py-16 lg:py-20 bg-white", children: /* @__PURE__ */ jsx("div", { className: "px-4 mx-auto max-w-7xl lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16", children: [
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Detalles del Servicio" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.1, children: /* @__PURE__ */ jsxs("div", { className: "p-6 border border-softGrey", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xl font-semibold text-darki font-prata", children: "Tipo de Servicio" }),
            /* @__PURE__ */ jsx("p", { className: "text-greyki font-dmsans", children: service.type || "Servicio Legal Profesional" })
          ] }) }),
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "p-6 border border-softGrey", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xl font-semibold text-darki font-prata", children: "Área de Especialización" }),
            /* @__PURE__ */ jsxs("p", { className: "text-greyki font-dmsans", children: [
              service.category,
              service.subcategory && /* @__PURE__ */ jsxs("span", { className: "block mt-1 text-sm", children: [
                "Subcategoría: ",
                service.subcategory
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "p-6 border border-softGrey", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xl font-semibold text-darki font-prata", children: "Beneficios de Nuestro Servicio" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-greyki font-dmsans", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 mr-3 text-golden" }),
                "Asesoría legal especializada y personalizada"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 mr-3 text-golden" }),
                "Acompañamiento durante todo el proceso"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 mr-3 text-golden" }),
                "Experiencia y conocimiento del mercado local"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 mr-3 text-golden" }),
                "Transparencia y comunicación constante"
              ] })
            ] })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "p-8 bg-softGrey/30 border border-softGrey", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Solicita tu Consulta" }),
        /* @__PURE__ */ jsxs("p", { className: "mb-6 text-greyki font-dmsans", children: [
          "¿Necesitas asesoría en ",
          service.name.toLowerCase(),
          "? Nuestro equipo de expertos está listo para ayudarte con tu caso específico."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.1, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center p-4 bg-white border border-softGrey", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6 mr-4 text-golden" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-darki font-prata", children: "Llámanos" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-greyki font-dmsans", children: "+1-258-987-000" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center p-4 bg-white border border-softGrey", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 mr-4 text-golden" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-darki font-prata", children: "Escríbenos" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-greyki font-dmsans", children: "admin@inmobiliariavergarayabogados.com" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center p-4 bg-white border border-softGrey", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 mr-4 text-golden" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-darki font-prata", children: "Horario" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-greyki font-dmsans", children: "Lun - Vie: 9:00 - 17:00" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(MotionWrapper, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(MainButton, { onClick: handleContactClick, className: "w-full justify-center", children: "Solicitar Consulta" }) }) })
      ] }) })
    ] }) }) }),
    lawyers && lawyers.length > 0 && /* @__PURE__ */ jsx("section", { className: "w-full py-16 lg:py-20 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "px-4 mx-auto max-w-7xl lg:px-8", children: [
      /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Nuestro Equipo Especializado" }),
        /* @__PURE__ */ jsxs("p", { className: "max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl", children: [
          "Conoce a nuestros abogados especialistas que pueden ayudarte con ",
          service.name
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-16 h-1 mx-auto mt-6 bg-golden lg:w-24" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3", children: lawyers.map((lawyer) => /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx(LawyerCard, { lawyer }) }, lawyer.id)) })
    ] }) })
  ] });
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceDetail
}, Symbol.toStringTag, { value: "Module" }));
const ServiceLawyersSection = ({ lawyers = [] }) => {
  if (!lawyers || lawyers.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-whiteki lg:py-20", children: /* @__PURE__ */ jsxs("div", { className: "px-4 mx-auto max-w-7xl lg:px-8", children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center lg:mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl", children: "Nuestro Equipo" }),
      /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl", children: "Conoce a nuestros abogados especialistas en derecho inmobiliario" }),
      /* @__PURE__ */ jsx("div", { className: "w-16 h-1 mx-auto mt-6 bg-golden lg:w-24" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3", children: lawyers.map((lawyer, index) => /* @__PURE__ */ jsx(MotionWrapper, { delay: index * 0.1, children: /* @__PURE__ */ jsx(LawyerCard, { lawyer }) }, lawyer.id)) })
  ] }) });
};
const Services = ({ services, lawyers, seo }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx(
      BannerInformative,
      {
        picture: "/images/shared/bg-services.webp",
        title: "Servicios",
        description: "Descubre los servicios legales que ofrecemos para proteger tus derechos y resolver tus problemas"
      }
    ) }),
    /* @__PURE__ */ jsx("section", { className: "relative w-full py-12 lg:py-20", style: {
      backgroundImage: "url('/images/shared/service-background.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }, children: /* @__PURE__ */ jsx(MotionWrapper, { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 px-4 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-8", children: services && services.map((service, index) => /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(CardService, { ...service }) }, service.id)) }) }) }),
    /* @__PURE__ */ jsx(ServiceLawyersSection, { lawyers })
  ] });
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Services
}, Symbol.toStringTag, { value: "Module" }));
const SITE_NAME = "Inmobiliaria Vergara y Abogados";
const DEFAULT_TITLE = `${SITE_NAME} — Abogados Inmobiliarios en Soacha, Cundinamarca`;
const DEFAULT_DESCRIPTION = "Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia. Compra, venta, arriendo y asesoría jurídica de propiedades. Consulta hoy.";
const DEFAULT_OG_IMAGE = "/logo.png";
function DefaultLayout({ children }) {
  const { props } = usePage();
  const seo = props.seo || {};
  const canonicalUrl = props.canonicalUrl || "";
  const corporativeInfo = props.corporativeInfo || null;
  const latestBlogs = props.latestBlogs || [];
  const title = seo.title || DEFAULT_TITLE;
  const description = seo.description || DEFAULT_DESCRIPTION;
  const keywords = seo.keywords || "";
  const ogImage = seo.og_image || DEFAULT_OG_IMAGE;
  return /* @__PURE__ */ jsxs("div", { className: "font-sans text-sm md:text-base", children: [
    /* @__PURE__ */ jsxs(Head_default, { children: [
      /* @__PURE__ */ jsx("title", { children: title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
      keywords && /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      canonicalUrl && /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "es_CO" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
      canonicalUrl && /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonicalUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage }),
      /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "CO-CUN" }),
      /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Soacha, Cundinamarca, Colombia" }),
      /* @__PURE__ */ jsx("meta", { name: "geo.position", content: "4.5790;-74.2172" }),
      /* @__PURE__ */ jsx("meta", { name: "ICBM", content: "4.5790, -74.2172" })
    ] }),
    /* @__PURE__ */ jsx(MainHeader, { styles: "bg-darki text-white/80", corporativeInfo }),
    /* @__PURE__ */ jsx("main", { className: "mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]", children }),
    /* @__PURE__ */ jsx(Footer, { latestBlogs, corporativeInfo }),
    /* @__PURE__ */ jsx(WhatsAppFloat, { corporativeInfo })
  ] });
}
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/About.jsx": __vite_glob_0_0, "./Pages/Blog/Index.jsx": __vite_glob_0_1, "./Pages/Blog/Show.jsx": __vite_glob_0_2, "./Pages/Contact.jsx": __vite_glob_0_3, "./Pages/Home.jsx": __vite_glob_0_4, "./Pages/LawyerDetail.jsx": __vite_glob_0_5, "./Pages/Properties.jsx": __vite_glob_0_6, "./Pages/PropertyDetail.jsx": __vite_glob_0_7, "./Pages/ServiceDetail.jsx": __vite_glob_0_8, "./Pages/Services.jsx": __vite_glob_0_9 });
      const component = pages[`./Pages/${name}.jsx`];
      component.default.layout ??= (page2) => /* @__PURE__ */ jsx(DefaultLayout, { children: page2 });
      return component;
    },
    setup: ({ App: App2, props }) => /* @__PURE__ */ jsx(App2, { ...props })
  })
);
