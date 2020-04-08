import util from '@/libs/util';
// 个人收藏夹
const favorites = {
    state: {
        favoriteData: [],
        treeData: [],  // tree数组
        objData: {}, // 当前元素
        addObjData: {},
        addYaosuData: {},
        addYaosuDataWenjian: {},
        checkName: "",
        shezhiData: {}  //修改当前要素
    },
    actions: {
        getPersonalFavoriteFiles ({
            state
        }, {userId}) {
            return new Promise((resolve, reject) => {
                // if (state.favoriteData.length !== 0) {
                //     console.log('getPersonalFavoriteFiles:cache');
                //     resolve(state.favoriteData);
                //     return;
                // }

                console.log('getPersonalFavoriteFiles:request');

                util.ajax.get('/km_server/' + userId).then(res => {
                    let retData = res.data;
                    if (retData.code !== 200) {
                        reject(retData);
                        return;
                    }
                    // console.log(retData.data);
                    state.favoriteData = retData.data;
                    resolve(state.favoriteData);
                }).catch((err) => {
                    reject(err);
                });
            });
        }
    },
    mutations: {
        favoritesDataManager (state, favoritesDataManager) {
            state.favoritesDataManager = favoritesDataManager;
        },
        treeData (state, treeData) {
            state.treeData = treeData;
        },
        objData (state, objData) {
            state.objData = objData;
        },
        addObjData (state, addObjData) {
            state.addObjData = addObjData;
        },
        addYaosuData (state, addYaosuData) {
            state.addYaosuData = addYaosuData;
        },
        addYaosuDataWenjian (state, addYaosuDataWenjian) {
            state.addYaosuDataWenjian = addYaosuDataWenjian;
        },
        checkName (state, checkName) {
            state.checkName = checkName;
        },
        shezhiData (state, shezhiData) {
            state.shezhiData = shezhiData;
        }

    }
};

export default favorites;