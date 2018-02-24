// @flow;

'use strict';

const TagChoices = {
    "types": {
        "feat": {
            "description": "    产品需求实现的一部分",
            "title": "需求"
        },
        "fix": {
            "description": " bug修复",
            "title": "bug修复"
        },
        "docs": {
            "description": "    添加/完善文档",
            "title": "文档"
        },
        "refactor": {
            "description": "不为了实现新功能或修复已有bug的代码修改",
            "title": "代码重构"
        },
        "test": {
            "description": "    添加新的测试用例或修改已有的测试用例",
            "title": "测试"
        },
        "build": {
            "description": "    打包",
            "title": "打包"
        },
        "revert": {
            "description": " Reverts一个过往的提交",
            "title": "Reverts"
        }
    }
};

const TagChoiceArray = Object.keys(TagChoices.types).map(function (key) {
    return {
        name: TagChoices.types[key].title + '    ' + TagChoices.types[key].description,
        value: key
    };
});

function whenFeat(answers) {
    return answers.type === 'feat';
}

function whenBug(answers) {
    return answers.type === 'fix';
}

function whenDoc(answers) {
    return answers.type === 'docs';
}

function whenRefactor(answers) {
    return answers.type === 'refactor';
}

function whenTest(answers) {
    return answers.type === 'test'
}

function whenRevert(answers) {
    return answers.type === 'revert';
}

function generateFeatHeader(answers, version, typeName) {
    let relativeFeatID = answers.relativeFeatID;
    if (!relativeFeatID) {
        throw '请输入需求编号';
    }

    const subject = answers.subject;
    if (!subject) {
        throw '主题输入错误';
    }

    const head = `[机票 V${version}] ${typeName}(${relativeFeatID}) ${subject}\n\n`;
    return head;
}

function generateFeatBody(answers) {
    let xuqiuWhat = generateMessageBlock('需求功能点', answers.xuqiuWhat);
    let xuqiuWhy = generateMessageBlock('需求实现思路', answers.xuqiuWhy);

    return `${xuqiuWhat}${xuqiuWhy}`;
}

function generateBugHeader(answers, version, typeName) {
    let relativeBugID = answers.relativeBugID;
    if (!relativeBugID) {
        throw '请输入Bug编号';
    }

    const subject = answers.subject;
    if (!subject) {
        throw '主题输入错误';
    }

    const head = `[机票 V${version}] ${typeName}(${relativeBugID}) ${subject}\n\n`;
    return head;
}

function generateBugBody(answers) {
    let bugWhat = generateMessageBlock('导致bug原因', answers.bugWhat);
    let bugWhy = generateMessageBlock('解决bug思路', answers.bugWhy);

    return `${bugWhat}${bugWhy}`;
}

function generateDocHeader(answers, version, typeName) {
    return generateCommonHeader(answers, version, typeName);
}

function generateDocBody(answers) {
    let docWhy = generateMessageBlock('修改文档原因', answers.docWhy);
    return docWhy;
}

function generateRefactorHeader(answers, version, typeName) {
    return generateCommonHeader(answers, version, typeName);
}

function generateRefactorBody() {
    let refactorWhat = generateMessageBlock('重构点', answers.refactorWhat);
    let refactorWhy = generateMessageBlock('重构实现思路', answers.refactorWhy);

    return `${refactorWhat}${refactorWhy}`;
}

function generateTestHeader(answers, version, typeName) {
    return generateCommonHeader(answers, version, typeName);
}

function generateTestBody(answers) {
    let testWhy = generateMessageBlock('添加/修改用例原因', answers.testWhy);
    return testWhy;
}

function generateRevertHeader(answers, version, typeName) {
    return generateCommonHeader(answers, version, typeName);
}

function generateRevertBody(answers) {
    let revertWhat = generateMessageBlock('revert的sha id', answers.revertWhat);
    if (!revertWhat) {
        throw 'revert的sha id不能为空';
    }

    return revertWhat;
}

function generateBuildHeader(answers, version, typeName) {
    return generateCommonHeader(answers, version, typeName);
}

function generateBuildBody() {
    return '';
}

function generateCommonHeader(answers, version, typeName) {
    const subject = answers.subject;
    if (!subject) {
        throw '主题输入错误';
    }

    const head = `[机票 V${version}] ${typeName} ${subject}\n\n`;
    return head;
}

function generateMessageBlock(title, content) {
    if (!content) {
        return '';
    }

    return `${title}：\n${content}\n\n`;
}

module.exports = {
    prompter: function (cz, commit) {
        cz.prompt([
            {
                type: 'input',
                name: 'version',
                message: '版本号，当前app版本，例如（7.05，7.05.2）：\n'
            }, {
                type: 'list',
                name: 'type',
                message: '修改类型，从以下选项中选择最符合的一项：\n',
                choices: TagChoiceArray
            }, {
                type: 'input',
                name: 'relativeFeatID',
                message: '需求号：\n',
                when: whenFeat
            }, {
                type: 'input',
                name: 'relativeBugID',
                message: 'Bug编号：\n',
                when: whenBug
            }, {
                type: 'input',
                name: 'subject',
                message: '主题，简要描述本次提交的内容：\n'
            }, {
                type: 'input',
                name: 'xuqiuWhat',
                message: '本次提交实现的需求功能点：\n',
                when: whenFeat
            }, {
                type: 'input',
                name: 'xuqiuWhy',
                message: '本次提交的实现思路（为什么这么实现）：\n',
                when: whenFeat
            }, {
                type: 'input',
                name: 'bugWhat',
                message: '导致bug的根本原因：\n',
                when: whenBug
            }, {
                type: 'input',
                name: 'bugWhy',
                message: '修复思路：\n',
                when: whenBug
            }, {
                type: 'input',
                name: 'docWhy',
                message: '添加/更新文档原因：\n',
                when: whenDoc
            }, {
                type: 'input',
                name: 'refactorWhat',
                message: '本次提交包含的重构点：\n',
                when: whenRefactor
            }, {
                type: 'input',
                name: 'refactorWhy',
                messsage: '本次重构的实现思路：\n',
                when: whenRefactor
            }, {
                type: 'input',
                name: 'testWhy',
                message: '添加/更新测试用例的原因：\n',
                when: whenTest
            }, {
                type: 'input',
                name: 'revertWhat',
                message: 'revert的commit shaid：\n',
                when: whenRevert
            }, {
                type: 'input',
                name: 'ps',
                message: '备注：\n'
            }
        ]).then(function (answers) {
            const version = answers.version;
            const versionRegexp = /^\d+\.\d{2}(\.[01234])?$/;
            if (!versionRegexp.test(version)) {
                throw '请输入正确的版本号';
            }

            let ps = answers.ps;
            if (ps) {
                ps = `备注:\n${ps}\n\n`;
            } else {
                ps = '';
            }

            let head;
            let body;
            const type = answers.type;
            const typeName = TagChoices.types[type].title;

            switch (type) {
                case 'feat':
                    head = generateFeatHeader(answers, version, typeName);
                    body = generateFeatBody(answers);
                    break;
                case 'fix':
                    head = generateBugHeader(answers, version, typeName);
                    body = generateBugBody(answers);
                    break;
                case 'docs':
                    head = generateDocHeader(answers, version, typeName);
                    body = generateDocBody(answers);
                    break;
                case 'refactor':
                    head = generateRefactorHeader(answers, version, typeName);
                    body = generateDocBody(answers);
                    break;
                case 'test':
                    head = generateTestHeader(answers, version, typeName);
                    body = generateTestBody(answers);
                    break;
                case 'revert':
                    head = generateRevertHeader(answers, version, typeName);
                    body = generateRevertBody(answers);
                case 'build':
                    head = generateBuildHeader(answers, version, typeName);
                    body = generateBuildBody();
                    break;
            }

            commit(`${head}${body}${ps}`);
        });
    }
};
