var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class EzIO {
    static loadImageFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "blob";
                request.open("GET", url, true);
                request.send();
                request.onload = () => __awaiter(this, void 0, void 0, function* () {
                    let img;
                    if (request.status == 200) {
                        img = yield createImageBitmap(request.response);
                        resolve(img);
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    }
    static loadArrayBufferFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "arraybuffer";
                request.open("GET", url, true);
                request.send();
                request.onload = () => __awaiter(this, void 0, void 0, function* () {
                    if (request.status == 200) {
                        resolve(request.response);
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    }
    static loadJsonFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.responseType = "json";
                request.open("GET", url, true);
                request.send();
                request.onload = () => __awaiter(this, void 0, void 0, function* () {
                    if (request.status == 200) {
                        resolve(request.response);
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    }
}
