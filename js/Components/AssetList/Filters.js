import * as constants from '../../Utils/Constants';
export const applyAssetListFilter = (assets) => {
    try {
        let mergeList = [];
        assets.forEach(element => {
            mergeList.push(element);
        });
        return mergeList.sort(custom_sort).reverse();
    }
    catch (e) {
        console.log("Error: applyAssetListFilter", e);
        return [];
    }

}

export const applyAssetListFilterByparamPrognosis = (assets, paramPrognosis) => {
    try {
        let mergeList = [];
        assets.forEach(element => {
            if (element.prognosisSummary1 == paramPrognosis || constants.ALL == paramPrognosis) {
                mergeList.push(element);
            }
        }); 
        return mergeList.sort(custom_sort).reverse(); 
    }
    catch (e) {
        console.log("Error: applyAssetListFilterByparamPrognosis", e);
        return [];
    }
}

function custom_sort(a, b) {
    return new Date(a.checkupTime).getTime() - new Date(b.checkupTime).getTime();
}