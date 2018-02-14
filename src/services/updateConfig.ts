export default async function updateConfig() {
    const config = fetchUpdateConfig();
    if (needUpdate(config)) {

    }
}

function fetchUpdateConfig() {}
function needUpdate(config: any): boolean {}