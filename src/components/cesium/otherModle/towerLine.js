import PrimitiveCollection from "cesium/Scene/PrimitiveCollection";
import Cartesian3 from "cesium/Core/Cartesian3";
import Matrix4 from "cesium/Core/Matrix4";
import Transforms from "cesium/Core/Transforms";
import Ellipsoid from "cesium/Core/Ellipsoid";
import Model from "cesium/Scene/Model";
import ColorBlendMode from "cesium/Scene/ColorBlendMode";
import Color from "cesium/Core/Color";
import HeadingPitchRoll from "cesium/Core/HeadingPitchRoll";
import CesiumMath from "cesium/Core/Math";
import DistanceDisplayCondition from "cesium/Core/DistanceDisplayCondition";
import {B08_J3, firstUrl, B08_J4, B08_Z1, B10_SJ3, B10_SJ4, B10_SZ1} from "../subMoudle/constants";

class TowerLine {
    constructor(t) {
        this.viewer = t, this.pCollection = new PrimitiveCollection, this.viewer.scene.primitives.add(this.pCollection)
    }

    calModelMartrix(t, i, o, r) {
        let e = Cartesian3.fromDegrees(t, i, o), a = new Matrix4;
        return Transforms.headingPitchRollToFixedFrame(e, r, Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame, a), a
    }

    createModelPrimitive(t, i) {
        return this.pCollection.add(Model.fromGltf({
            url: t,
            modelMatrix: i,
            colorBlendMode: ColorBlendMode.HIGHLIGHT,
            distanceDisplayCondition: new DistanceDisplayCondition(10, 1e3)
        }))
    }

    createModelPrimitiveWithColor(t, i) {
        return this.pCollection.add(Model.fromGltf({
            url: t,
            modelMatrix: i,
            color: new Color(0, 1, 1, 1),
            colorBlendAmount: .8,
            colorBlendMode: ColorBlendMode.MIX,
            distanceDisplayCondition: new DistanceDisplayCondition(10, 1e3)
        }))
    }

    createModelPrimitiveWithRedColor(t, i) {
        return this.pCollection.add(Model.fromGltf({
            url: t,
            modelMatrix: i,
            color: Color.RED.withAlpha(0.8),
            colorBlendAmount: 0.8,
            colorBlendMode: ColorBlendMode.MIX,
            distanceDisplayCondition: new DistanceDisplayCondition(10, 1e3)
        }));
    }

    transModelMatrix(t, i, o, r) {
        let e = new Cartesian3(i, o, r);
        return Matrix4.multiplyByTranslation(t, e, new Matrix4)
    }

    addModelB08_J3(t, i, o, r, e, a) {
        r > 24 && (r = 24), r < 9 && (r = 9);
        let l = r - 9, s = B08_J3 + r + '.glb', d = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            M = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), m = this.calModelMartrix(t, i, o, M),
            n = this.createModelPrimitiveWithColor(s, this.calModelMartrix(t, i, o, d));
        n.modelInfo = a;
        let h = this.transModelMatrix(m, 0, .1, 15.8 + l), x = this.transModelMatrix(m, 0, -.1, 15.8 + l),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 1.9, .366, 12.6 + l)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 1.9, -.366, 12.6 + l)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, -3, .35, 9 + l)),
            C = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, -3, -.35, 9 + l)),
            f = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 2, .35, 9 + l)),
            v = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 2, -.35, 9 + l));
        return {
            model: n,
            chuanCoord: [{
                groundPos: this.transCoordToLatLonNew(h[12], h[13], h[14]),
                topPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
                btmLPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14]),
                btmRPos: this.transCoordToLatLon(f.modelMatrix[12], f.modelMatrix[13], f.modelMatrix[14])
            }, {
                groundPos: this.transCoordToLatLonNew(x[12], x[13], x[14]),
                topPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
                btmLPos: this.transCoordToLatLon(C.modelMatrix[12], C.modelMatrix[13], C.modelMatrix[14]),
                btmRPos: this.transCoordToLatLon(v.modelMatrix[12], v.modelMatrix[13], v.modelMatrix[14])
            }]
        }
    }

    addModelB08_J4(t, i, o, r, e) {
        let a = r - 9, l = B08_J4 + r + ".glb", s = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            d = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), M = this.calModelMartrix(t, i, o, d);
        this.createModelPrimitiveWithColor(l, this.calModelMartrix(t, i, o, s));
        let m = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, .1, 15.8 + a)),
            n = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, -.1, 15.8 + a)),
            h = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, .3875, 12.6 + a)),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, -.3875, 12.6 + a)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.4, .6915, 9 + a)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.4, -.6915, 9 + a)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, .6915, 9 + a)),
            C = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, -.6915, 9 + a));
        return [{
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topPos: this.transCoordToLatLon(h.modelMatrix[12], h.modelMatrix[13], h.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14])
        }, {
            groundPos: this.transCoordToLatLon(n.modelMatrix[12], n.modelMatrix[13], n.modelMatrix[14]),
            topPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(C.modelMatrix[12], C.modelMatrix[13], C.modelMatrix[14])
        }]
    }

    addModelB08_Z1(t, i, o, r, e, a) {
        r > 30 && (r = 30), r < 12 && (r = 12);
        let l = r - 12, s = B08_Z1 + r + ".glb",
            d = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            M = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), m = this.calModelMartrix(t, i, o, M),
            n = this.createModelPrimitive(s, this.calModelMartrix(t, i, o, d));
        n.modelInfo = a;
        let h = this.transModelMatrix(m, .45, 0, 17.4 + l),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 1.9, 0, 14.6 + l)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, -2.3, 0, 12 + l)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(m, 2.3, 0, 12 + l));
        return {
            model: n,
            chuanCoord: [{
                groundPos: this.transCoordToLatLonNew(h[12], h[13], h[14]),
                topPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
                btmLPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
                btmRPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14])
            }]
        }
    }

    addModelB10_SJ3(t, i, o, r, e) {
        let a = r - 9, l = B10_SJ3 + r + ".glb",
            s = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            d = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), M = this.calModelMartrix(t, i, o, d);
        this.createModelPrimitiveWithColor(l, this.calModelMartrix(t, i, o, s));
        let m = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, .15, 20 + a)),
            n = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, -.15, 20 + a)),
            h = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -2.75, .3, 14 + a)),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -2.75, -.3, 14 + a)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.6, .3, 14 + a)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.6, -.3, 14 + a)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.2, .3, 11.5 + a)),
            C = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.2, -.3, 11.5 + a)),
            f = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 2, .3, 11.5 + a)),
            v = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 2, -.3, 11.5 + a)),
            T = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3, .3, 9 + a)),
            u = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3, -.3, 9 + a)),
            U = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, .3, 9 + a)),
            p = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, -.3, 9 + a));
        return [{
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(h.modelMatrix[12], h.modelMatrix[13], h.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(f.modelMatrix[12], f.modelMatrix[13], f.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(T.modelMatrix[12], T.modelMatrix[13], T.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(U.modelMatrix[12], U.modelMatrix[13], U.modelMatrix[14])
        }, {
            groundPos: this.transCoordToLatLon(n.modelMatrix[12], n.modelMatrix[13], n.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(C.modelMatrix[12], C.modelMatrix[13], C.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(v.modelMatrix[12], v.modelMatrix[13], v.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(u.modelMatrix[12], u.modelMatrix[13], u.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(p.modelMatrix[12], p.modelMatrix[13], p.modelMatrix[14])
        }]
    }

    addModelB10_SJ4(t, i, o, r, e) {
        let a = r - 9, l = B10_SJ4 + r + ".glb",
            s = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            d = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), M = this.calModelMartrix(t, i, o, d);
        this.createModelPrimitiveWithColor(l, this.calModelMartrix(t, i, o, s));
        let m = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, .25, 20.7 + a)),
            n = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 0, -.25, 20.7 + a)),
            h = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.1, .5895, 14 + a)),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.1, -.5895, 14 + a)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, .5895, 14 + a)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, -.5895, 14 + a)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.6, .6945, 11.5 + a)),
            C = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.6, -.6945, 11.5 + a)),
            f = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, .6945, 11.5 + a)),
            v = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.8, -.6945, 11.5 + a)),
            T = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.4, .812, 9 + a)),
            u = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -3.4, -.812, 9 + a)),
            U = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.6, .812, 9 + a)),
            p = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.6, -.812, 9 + a));
        return [{
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(h.modelMatrix[12], h.modelMatrix[13], h.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(f.modelMatrix[12], f.modelMatrix[13], f.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(T.modelMatrix[12], T.modelMatrix[13], T.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(U.modelMatrix[12], U.modelMatrix[13], U.modelMatrix[14])
        }, {
            groundPos: this.transCoordToLatLon(n.modelMatrix[12], n.modelMatrix[13], n.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(C.modelMatrix[12], C.modelMatrix[13], C.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(v.modelMatrix[12], v.modelMatrix[13], v.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(u.modelMatrix[12], u.modelMatrix[13], u.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(p.modelMatrix[12], p.modelMatrix[13], p.modelMatrix[14])
        }]
    }

    addModelB10_SZ1_simple(t, i, o, r, e) {
        let a = r - 12, l = B10_SZ1 + r + ".glb",
            s = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            d = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), M = this.calModelMartrix(t, i, o, d);
        this.createModelPrimitive(l, this.calModelMartrix(t, i, o, s));
        let m = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, .3, 0, 21.5 + a)),
            n = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, 0, 17.2 + a)),
            h = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, 0, 17.2 + a)),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -2.3, 0, 14.5 + a)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 2.3, 0, 14.5 + a)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, 0, 12 + a)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, 0, 12 + a));
        return [{
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(n.modelMatrix[12], n.modelMatrix[13], n.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(h.modelMatrix[12], h.modelMatrix[13], h.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14])
        }]
    }

    addModelB10_SZ1_double(t, i, o, r, e) {
        let a = r - 12, l = B10_SZ1 + r + ".glb",
            s = new HeadingPitchRoll(0, Math.PI / 2, CesiumMath.toRadians(180 - e)),
            d = new HeadingPitchRoll(CesiumMath.toRadians(e + 90), 0, 0), M = this.calModelMartrix(t, i, o, d);
        this.createModelPrimitive(l, this.calModelMartrix(t, i, o, s));
        let m = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, .3, 0, 21.5 + a)),
            n = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, .2, 17.2 + a)),
            h = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, -.2, 17.2 + a)),
            x = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, .2, 17.2 + a)),
            L = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, -.2, 17.2 + a)),
            P = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -2.3, .2, 14.5 + a)),
            c = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -2.3, -.2, 14.5 + a)),
            C = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 2.3, .2, 14.5 + a)),
            f = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 2.3, -.2, 14.5 + a)),
            v = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, .2, 12 + a)),
            T = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, -1.9, -.2, 12 + a)),
            u = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, .2, 12 + a)),
            U = this.createModelPrimitive(firstUrl, this.transModelMatrix(M, 1.9, -.2, 12 + a));
        return [{
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(n.modelMatrix[12], n.modelMatrix[13], n.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(x.modelMatrix[12], x.modelMatrix[13], x.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(P.modelMatrix[12], P.modelMatrix[13], P.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(C.modelMatrix[12], C.modelMatrix[13], C.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(v.modelMatrix[12], v.modelMatrix[13], v.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(u.modelMatrix[12], u.modelMatrix[13], u.modelMatrix[14])
        }, {
            groundPos: this.transCoordToLatLon(m.modelMatrix[12], m.modelMatrix[13], m.modelMatrix[14]),
            topLPos: this.transCoordToLatLon(h.modelMatrix[12], h.modelMatrix[13], h.modelMatrix[14]),
            topRPos: this.transCoordToLatLon(L.modelMatrix[12], L.modelMatrix[13], L.modelMatrix[14]),
            midLPos: this.transCoordToLatLon(c.modelMatrix[12], c.modelMatrix[13], c.modelMatrix[14]),
            midRPos: this.transCoordToLatLon(f.modelMatrix[12], f.modelMatrix[13], f.modelMatrix[14]),
            btmLPos: this.transCoordToLatLon(T.modelMatrix[12], T.modelMatrix[13], T.modelMatrix[14]),
            btmRPos: this.transCoordToLatLon(U.modelMatrix[12], U.modelMatrix[13], U.modelMatrix[14])
        }]
    }

    transCoordToLatLon(t, i, o) {
        let r = this.viewer.scene.globe.ellipsoid, e = new Cartesian3(t, i, o), a = r.cartesianToCartographic(e),
            l = CesiumMath.toDegrees(a.latitude);
        return [CesiumMath.toDegrees(a.longitude), l, a.height - 1.32]
    }

    transCoordToLatLonNew(t, i, o) {
        let r = this.viewer.scene.globe.ellipsoid, e = new Cartesian3(t, i, o), a = r.cartesianToCartographic(e),
            l = CesiumMath.toDegrees(a.latitude);
        return [CesiumMath.toDegrees(a.longitude), l, a.height]
    }

    removeAllCollection() {
        this.pCollection.removeAll()
    }

    hideAllCollection(t) {
        let i = this.pCollection.length;
        for (let o = 0; o < i; ++o) {
            this.pCollection.get(o).show = t
        }
    }
}

export default TowerLine;
