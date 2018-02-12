// TODO 增加jest-junit配置.
export default {
    "preset": "react-native",
    "transform": {
        "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
    ],
    "unmockedModulePathPatterns": [
        "<rootDir>/node_modules/react"
    ],
    "moduleNameMapper": {
        "@ctrip/crn": "<rootDir>/node_modules/Flight-GeneralFunction/__mocks__/@ctrip/crn/crn.js"
    },
    "collectCoverageFrom": [
        "**/src/**/*.ts"
    ],
    "coveragePathIgnorePatterns": [
        "/@types/",
        "**/enum.ts",
        "**/interface.ts"
    ],
    "coverageReporters": [
        "json-summary",
        "lcov",
        "text",
        "html"
    ]
}