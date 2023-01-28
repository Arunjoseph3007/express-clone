export const swaggerStringify = (obj: any) => {
  const placeholder = "____FUNCTIONPLACEHOLDER____";
  const fns: Function[] = [];
  let json = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "function") {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2
  );
  json = json.replace(new RegExp('"' + placeholder + '"', "g"), () => {
    return (fns.shift() as Function).toString();
  });
  return "var options = " + json + ";";
};

function toExternalScriptTag(url: string) {
  return `<script src='${url}'></script>`;
}

function toInlineScriptTag(jsCode: string) {
  return `<script>${jsCode}</script>`;
}

function toExternalStylesheetTag(url: string) {
  return `<link href='${url}' rel='stylesheet'>`;
}

function toTags(customCode: any, toScript: (a: any) => any) {
  if (typeof customCode === "string") {
    return toScript(customCode);
  } else if (Array.isArray(customCode)) {
    return customCode.map(toScript).join("\n");
  } else {
    return "";
  }
}

const favIconHtml =
  '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />';

export const SWAGGER_INIT_JS_TMPL = `
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  <% swaggerOptions %>
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)
  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }
  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  window.ui = ui
}
`;

export const SWAGGER_INIT_HTML_TMPL = `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><% title %></title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" >
  <% favIconString %>
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
  <defs>
    <symbol viewBox="0 0 20 20" id="unlocked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
    </symbol>
    <symbol viewBox="0 0 20 20" id="locked">
      <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"/>
    </symbol>
    <symbol viewBox="0 0 20 20" id="close">
      <path d="M14.348 14.849c-.469.469-1.229.469-1.697 0L10 11.819l-2.651 3.029c-.469.469-1.229.469-1.697 0-.469-.469-.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-.469-.469-.469-1.228 0-1.697.469-.469 1.228-.469 1.697 0L10 8.183l2.651-3.031c.469-.469 1.228-.469 1.697 0 .469.469.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c.469.469.469 1.229 0 1.698z"/>
    </symbol>
    <symbol viewBox="0 0 20 20" id="large-arrow">
      <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/>
    </symbol>
    <symbol viewBox="0 0 20 20" id="large-arrow-down">
      <path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/>
    </symbol>
    <symbol viewBox="0 0 24 24" id="jump-to">
      <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
    </symbol>
    <symbol viewBox="0 0 24 24" id="expand">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </symbol>
  </defs>
</svg>
<div id="swagger-ui"></div>
<script src="./swagger-ui-bundle.js"> </script>
<script src="./swagger-ui-standalone-preset.js"> </script>
<script src="./swagger-ui-init.js"> </script>
<% customJs %>
<% customJsStr %>
<% customCssUrl %>
<style>
  <% customCss %>
</style>
</body>
</html>
`;

export const DEAFAULT_SWAGGER_OPTS = {
  swagger: "2.0",
  info: {
    title: "Express Typescript starter",
    description:
      "An excellent starter setup with documentation using Swagger UI",
    version: "1.0.0",
  },
  host: "localhost:8000",
  basePath: "/",
  schemes: ["http"],
  paths: {
    "/api/books/": {
      post: {
        tags: ["Book"],
        description: "",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              type: "object",
              properties: {
                name: {
                  example: "any",
                },
                userId: {
                  example: "any",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            schema: {
              $ref: "#/definitions/Book",
            },
          },
        },
      },
      get: {
        tags: ["Book"],
        description: "",
        parameters: [],
        responses: {
          "200": {
            description: "OK",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/Book",
              },
              xml: {
                name: "main",
              },
            },
          },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        tags: ["Book"],
        description: "",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          "200": {
            description: "OK",
            schema: {
              $ref: "#/definitions/Book",
            },
          },
          "400": {
            description: "Bad Request",
          },
        },
      },
      put: {
        tags: ["Book"],
        description: "",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "body",
            in: "body",
            schema: {
              type: "object",
              properties: {
                where: {
                  example: "any",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            schema: {
              $ref: "#/definitions/Book",
            },
          },
          "404": {
            description: "Not Found",
          },
        },
      },
      delete: {
        tags: ["Book"],
        description: "",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          "200": {
            description: "OK",
          },
          "404": {
            description: "Not Found",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        description: "",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              type: "object",
              properties: {
                username: {
                  example: "any",
                },
                email: {
                  example: "any",
                },
                password: {
                  example: "any",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        description: "",
        parameters: [
          {
            name: "body",
            in: "body",
            schema: {
              type: "object",
              properties: {
                username: {
                  example: "any",
                },
                password: {
                  example: "any",
                },
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
          },
          "404": {
            description: "Not Found",
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        description: "",
        parameters: [],
        responses: {},
      },
    },
  },
  definitions: {
    Book: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "clb3j3xn50008yutbw13cjufb",
        },
        name: {
          type: "string",
          example: "Harry porter",
        },
        userId: {
          type: "string",
          example: "clb3j0ur00000yutbm8im7vmu",
        },
        createdAt: {
          type: "string",
          example: "2022-11-30T10:52:26.514Z",
        },
        updatedAt: {
          type: "string",
          example: "2022-11-30T10:52:10.144Z",
        },
      },
    },
    User: {
      type: "object",
      properties: {
        id: {
          type: "string",
          example: "clb3j0ur00000yutbm8im7vmu",
        },
        username: {
          type: "string",
          example: "Harry Porter",
        },
        email: {
          type: "string",
          example: "abcd.xyz@gmail.com",
        },
      },
    },
  },
};

export const generateHTML = function (
  swaggerDoc?: any,
  opts?: any,
  options?: any,
  customCss?: any,
  customfavIcon?: any,
  swaggerUrl?: string,
  customSiteTitle?: string,
  _htmlTplString?: string,
  _jsTplString?: string
) {
  var isExplorer;
  var customJs;
  var customJsStr;
  var swaggerUrls;
  var customCssUrl;
  if (opts && typeof opts === "object") {
    options = opts.swaggerOptions;
    customCss = opts.customCss;
    customJs = opts.customJs;
    customJsStr = opts.customJsStr;
    customfavIcon = opts.customfavIcon;
    swaggerUrl = opts.swaggerUrl;
    swaggerUrls = opts.swaggerUrls;
    isExplorer = opts.explorer || !!swaggerUrls;
    customSiteTitle = opts.customSiteTitle;
    customCssUrl = opts.customCssUrl;
  } else {
    //support legacy params based function
    isExplorer = opts;
  }
  options = options || {};
  var explorerString = isExplorer
    ? ""
    : ".swagger-ui .topbar .download-url-wrapper { display: none }";
  customCss = explorerString + " " + customCss || explorerString;
  customfavIcon = customfavIcon || false;
  customSiteTitle = customSiteTitle || "Swagger UI";
  _htmlTplString = _htmlTplString || SWAGGER_INIT_HTML_TMPL;
  _jsTplString = _jsTplString || SWAGGER_INIT_JS_TMPL;

  var favIconString = customfavIcon
    ? '<link rel="icon" href="' + customfavIcon + '" />'
    : favIconHtml;

  var htmlWithCustomCss = _htmlTplString
    .toString()
    .replace("<% customCss %>", customCss);
  var htmlWithFavIcon = htmlWithCustomCss.replace(
    "<% favIconString %>",
    favIconString
  );
  var htmlWithCustomJsUrl = htmlWithFavIcon.replace(
    "<% customJs %>",
    toTags(customJs, toExternalScriptTag)
  );
  var htmlWithCustomJs = htmlWithCustomJsUrl.replace(
    "<% customJsStr %>",
    toTags(customJsStr, toInlineScriptTag)
  );
  var htmlWithCustomCssUrl = htmlWithCustomJs.replace(
    "<% customCssUrl %>",
    toTags(customCssUrl, toExternalStylesheetTag)
  );

  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: options,
    swaggerUrl: swaggerUrl || undefined,
    swaggerUrls: swaggerUrls || undefined,
  };

  return htmlWithCustomCssUrl.replace("<% title %>", customSiteTitle);
};
