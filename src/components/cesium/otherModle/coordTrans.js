/* eslint-disable */
/**
 * Created by pengYX on 2018/5/4.
 */

const ZONE_TYPE = {
    ZONE_3: 3,
    ZONE_6: 6
};
class CoordTrans {
    constructor () {
       this.zoneType=ZONE_TYPE.ZONE_3;
       let a = 6378140.0, b = 6356755.288158;
       let c = a * a / b;
       let f = 1.0 / 298.257;
       let e1 = f * (2 - f);
       let e2 = e1 / (1 - e1);

       this.a=a;
       this.b=b;
       this.c=c;
       this.f=f;
       this.e1=e1;
       this.e2=e2;
    };

    BLH2xyh(point){//角度值
        let L=point.x* Math.PI / 180.0;//转弧度
        let B=point.y* Math.PI / 180.0;//转弧度
        let res= CalculateCentralL1(L,this.zoneType);
        let zone_index=res[0];
        let L0=res[1];
        let sinB=Math.sin(B),cosB =Math.cos(B),cosBl = cosB * (L0 - L);
        let t = Math.tan(B),t2 = Math.pow(t, 2), t4 = Math.pow(t, 4), t6 = Math.pow(t, 6);
        let n2 = this.e2 * cosB * cosB, N = this.a /Math.sqrt(1 - this.e1 * sinB * sinB),Nt = N * t;
        let x=CalculateMeridian(B,5,this.a,this.e1);
        x += Nt * Math.pow(cosBl, 2) / 2.0;
        x += Nt * Math.pow(cosBl, 4) * (5 - t2 + 9 * n2 + 4 * n2 * n2) / 24.0;
        x += Nt * Math.pow(cosBl, 6) * (61 - 58 * t2 + t4 + 270 * n2 - 330 * t2 * n2) / 720.0;
        x += Nt * Math.pow(cosBl, 8) * (1385 - 3111 * t2 + 543 * t4 - t6) / 40320.0;
        let y = zone_index * 1000000 + 500000 - N * cosBl;
        y -= N * Math.pow(cosBl, 3) * (1 - t2 + n2) / 6.0;
        y -= N * Math.pow(cosBl, 5) * (5 - 18 * t2 + t4 + 14 * n2 - 58 * t2 * n2) / 120.0;
        y -= N * Math.pow(cosBl, 7) * (61 - 479 * t2 + 179 * t4 - t6) / 5040.0;
       let z = point.z;
       return {'x':x,'y':y,'z':z};
    };

    xyh2BLH(point){
        let  zone_index=Math.floor(point.x/1000000);
        let L0= CalculateCentralL2(point.x, zone_index,this.zoneType);
        let Bf = CalculateBf(point.y,this.b,this.a,this.e1);
        let cBf, tf, tf2, tf4, nf2, vf, yNf, yNf2, yNf3, yNf4, yNf5, yNf6;
        cBf = Math.cos(Bf); nf2 = this.e2 * cBf * cBf; vf = Math.sqrt(1 + nf2);
        tf = Math.tan(Bf); tf2 = Math.pow(tf, 2); tf4 = Math.pow(tf, 4);
        yNf = (point.x - zone_index * 1000000 - 500000) * vf / this.c;
        yNf2 = Math.pow(yNf, 2); yNf3 = Math.pow(yNf, 3); yNf4 = Math.pow(yNf, 4);
        yNf5 = Math.pow(yNf, 5); yNf6 = Math.pow(yNf, 6);

        let y = Bf - 1.0 / 2.0 * vf * vf * tf * (yNf2 - 1.0 / 12.0 * yNf4 * (5 +
            3 * tf2 + nf2 - 9 * nf2 * tf2) + 1.0 / 360.0 * (61 + 90.0 * tf2 + 45 * tf4) * yNf6);
        let x = (yNf - (1 + 2 * tf2 + nf2) * yNf3 / 6.0 + (5 +
            28 * tf2 + 24 * tf4 + 6 * nf2 + 8 * nf2 * tf2) * yNf5 / 120.0) / cBf + L0;
        let z = point.z;
        return {'x':x/Math.PI*180,'y':y/Math.PI*180,'z':z};
    };

   /* XYZ2BLH(point){
       let xy=Math.sqrt(point.x*point.x+point.y*point.y);
       let Bo=Math.atan(point.z/xy);
       let sBo=Math.sign(Bo);
       let cBo=Math.cos(Bo);
       let N=a/Math.sqrt(1-this.e1*sBo*sBo);
       let Ho=xy/cBo-N;
       let res={lng:0,lat:0,alt:0};
       do{
          res.lng=Bo;
          res.alt=Ho;
           Bo = Math.atan((res.alt + N * this.e1 * sBo) / xy);
           sBo = Math.sin(Bo); cBo = Math.cos(Bo);
           N = this.a / Math.sqrt(1 - this.e1 * sBo * sBo);
           H0 = xy / cBo - N;
       }while(Math.abs(res.lng-Bo)>4e-13&&Math.abs(res.alt-Ho)>4e-13)
    };*/

}
function CalculateBf (x,b,a,e1) {
    let d, e4, a0, a2, a4, a6, a8, Bf, tempBf, sinb, sinb2;
    d = b * b / a; e4 = e1 * e1;
    a2 = d * e1 * (3.0 / 4.0 + e1 * (45.0 / 64.0 + 175.0 / 256.0 * e1 + 11025.0 / 16384.0 * e4));
    a0 = d + a2; Bf = x / a0;
    a4 = d * e4 * (15.0 / 32.0 + 175.0 / 384.0 * e1 + 3675.0 / 8192.0 * e4);
    a6 = d * e4 * e1 * (35.0 / 96.0 + 735.0 / 2048.0 * e1);
    a8 = d * e4 * e4 * 315.0 / 1024.0;
    do
    {
        tempBf = Bf;
        sinb = Math.sin(tempBf); sinb2 = sinb * sinb;
        Bf = (x + Math.cos(tempBf) * (sinb * (a2 + sinb2 * (a4 + sinb2 * (a6 + a8 * sinb2))))) / a0;
    } while (Math.abs(Bf - tempBf) > 4E-13);
    return Bf;
}
function CalculateCentralL2 (y,zone_index,zone_type) {
    if (zone_type ===ZONE_TYPE.ZONE_3)
        return (zone_index * 3) * Math.PI / 180.0;
    else
        return (zone_index * 6 - 3) * Math.PI / 180.0;
}
function CalculateCentralL1 (L,zone_type) {
    let y= L /Math.PI * 180.0;
    if(zone_type ===ZONE_TYPE.ZONE_3 ){
        let zone_index=Math.floor((y+1.5)/3);
        let L0=zone_index *3* Math.PI / 180.0;
        return [zone_index,L0];
    }else{
        let zone_index=Math.floor(y/6+1);
        let L0=(zone_index*6-3) * Math.PI / 180.0;
        return [zone_index,L0];
    }
}
function CalculateMeridian (L,n,a,el) {
     let c =[];
    for (let i = 0; i < n; i++)
         c.push(0.0);
    let cc = 1.0;
    for (let i = 1; i <= n; i++)
    {
        cc *= ((2 * i - 1.0) * (2 * i + 1.0) / (4 * i * i)) * el;
        for (let j = 0; j < i; j++)
            c[j] += cc;
    }
    let k = 1.0, f1 = 1.0 + c[0], f2 = -c[0], sinl = Math.sin(L);
    for (let i = 1; i < n; i++)
    {
        k *= 2 * i / (2 * i + 1.0) * sinl * sinl;
        f2 -= c[i] * k;
    }
    return a * (1 - el) * (f1 * L + f2 * sinl * Math.cos(L));
}
export default CoordTrans

