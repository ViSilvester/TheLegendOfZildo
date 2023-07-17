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
}
export class Edge {
    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
    }
}
export class geometryUtils {
    intersect(k, l, m, n, intersec) {
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
    distEntre2Pontos(p1, p2) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return Math.sqrt((x * x) + (y * y));
    }
    vetorUnit(p) {
        var v = new Vec2(p.x / Math.sqrt((p.x * p.x) + (p.y * p.y)), p.y / Math.sqrt((p.x * p.x) + (p.y * p.y)));
        return v;
    }
    vecModulo(p) {
        return Math.sqrt((p.x * p.x) + (p.y * p.y));
    }
    produtoEscalar(p1, p2) {
        return (p1.x * p2.x) + (p1.y * p2.y);
    }
    vecMultiplication(p1, n) {
        return new Vec2(p1.x * n, p1.y * n);
    }
    vecProjection(p1, p2) {
        return this.vecMultiplication(p2, (this.produtoEscalar(p1, p2) / this.produtoEscalar(p2, p2)));
    }
    interpolateVec3(p1, p2, level) {
        return new Vec3(p1.x + (level * (p2.x - p1.x)), p1.y + (level * (p2.y - p1.y)), p1.z + (level * (p2.z - p1.z)));
    }
    interpolateVec2(p1, p2, level) {
        return new Vec2(p1.x + (level * (p2.x - p1.x)), p1.y + (level * (p2.y - p1.y)));
    }
}
