const updateTurbinGroupColor = function (turbineGroup) {
    if (!turbineGroup) return;
    turbineGroup.forEach((group, index) => {
        let ids = [];
        group.turbineID.forEach(turbin => {
            ids.push(turbin.turbine_id);
        });
        updateTurbinsColor(ids, index);
    });
}

const updateDefaultTurbinGroup = function (turbins) {
    if (!turbins) return;
    let ids = [];
    turbins.forEach(turbin => {
        ids.push(turbin.turbine_id);
    });
    updateTurbinsColor(ids);
}

const updateTurbinsColor = function (turbins, groupIndex) {
    window.viewer.showGroupFanLabel(turbins, getTurbinColor(groupIndex));
}

const getTurbinColor = function (index) {
    if (isNaN(index) || index < 0)
        return DefaultTurbinColor;
    return TurbinColor[index % TurbinColor.length];
}
const getTurbinClass = function (index) {
    if (isNaN(index) || index < 0)
        return 'turbineColor';
    return TurbinClass[index % TurbinClass.length];
}

const DefaultTurbinColor = '#00B851';
const TurbinColor = ['#F48A0D', '#12CFBD', '#8C49FB', '#75A6FC', '#EB2867'];
const TurbinClass = ['turbineColor0', 'turbineColor1', 'turbineColor2', 'turbineColor3', 'turbineColor4'];

export { updateTurbinGroupColor,updateDefaultTurbinGroup ,updateTurbinsColor,getTurbinColor}