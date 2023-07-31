export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static sum(v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
}
export class Rect {
    constructor(pos, dim) {
        this.pos = pos;
        this.dim = dim;
    }
    checkIntersect(r) {
        if (this.pos.x < r.pos.x && this.pos.x + this.dim.x < r.pos.x ||
            this.pos.x > r.pos.x + r.dim.x && this.pos.x + this.dim.x > r.pos.x + r.dim.x ||
            this.pos.y < r.pos.y && this.pos.y + this.dim.y < r.pos.y ||
            this.pos.y > r.pos.y + r.dim.y && this.pos.y + this.dim.y > r.pos.y + r.dim.y) {
            return false;
        }
        return true;
    }
}
export class Edge {
    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
    }
}
export class Geometry {
    static lineSegmentIntersect(k, l, m, n, intersec) {
        var det = (n.x - m.x) * (l.y - k.y) - (n.y - m.y) * (l.x - k.x);
        if (det == 0.0) {
            return false; // não há intersecção
        }
        var s = ((n.x - m.x) * (m.y - k.y) - (n.y - m.y) * (m.x - k.x)) / det;
        var t = ((l.x - k.x) * (m.y - k.y) - (l.y - k.y) * (m.x - k.x)) / det;
        intersec.x = k.x + (l.x - k.x) * s;
        intersec.y = k.y + (l.y - k.y) * s;
        if ((intersec.x < k.x && intersec.x < l.x)
            ||
                (intersec.x > k.x && intersec.x > l.x)
            ||
                (intersec.y < k.y && intersec.y < l.y)
            ||
                (intersec.y > k.y && intersec.y > l.y)) {
            return false;
        }
        if ((intersec.x < m.x && intersec.x < n.x)
            ||
                (intersec.x > m.x && intersec.x > n.x)
            ||
                (intersec.y < m.y && intersec.y < n.y)
            ||
                (intersec.y > m.y && intersec.y > n.y)) {
            return false;
        }
        return true; // há intersecção
    }
    static distVec2(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return Math.sqrt((x * x) + (y * y));
    }
    static distVec3(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var z = p1.z - p2.z;
        return Math.sqrt((x * x) + (y * y) + (z * z));
    }
    static vetorUnit(p) {
        var v = new Vec2(p.x / Math.sqrt((p.x * p.x) + (p.y * p.y)), p.y / Math.sqrt((p.x * p.x) + (p.y * p.y)));
        return v;
    }
    static vecModulo(p) {
        return Math.sqrt((p.x * p.x) + (p.y * p.y));
    }
    static produtoEscalar(p1, p2) {
        return (p1.x * p2.x) + (p1.y * p2.y);
    }
    static vecMultiplication(p1, n) {
        return new Vec2(p1.x * n, p1.y * n);
    }
    static vecProjection(p1, p2) {
        return this.vecMultiplication(p2, (this.produtoEscalar(p1, p2) / this.produtoEscalar(p2, p2)));
    }
    static interpolateVec3(p1, p2, level) {
        return new Vec3(p1.x + (level * (p2.x - p1.x)), p1.y + (level * (p2.y - p1.y)), p1.z + (level * (p2.z - p1.z)));
    }
    static interpolateVec2(p1, p2, level) {
        return new Vec2(p1.x + (level * (p2.x - p1.x)), p1.y + (level * (p2.y - p1.y)));
    }
}
