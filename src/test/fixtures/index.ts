import { Server } from 'spirit.io/lib/application';
import { context, run } from 'f-promise';
import { Fixtures as GlobalFixtures } from 'spirit.io/test/fixtures';
import * as path from 'path';
import * as importTool from 'spirit.io/lib/tools/import';

const port = 8000;
const mongodbPort = process.env.SPIRIT_MONGODB_PORT || 27017;

const config = {
    port: port,
    modelsLocation: path.resolve(path.join(__dirname, '../../lib/models')),
    store: {
        name: 'mongo-store',
        connection: {
            uri: 'mongodb://localhost:' + mongodbPort + '/spirit_users_test',
            options: {}
        }
    }
};

export class Fixtures extends GlobalFixtures {

    static setup = (done) => {
        function reset() {
            Fixtures.removaAllDocuments();
            // import data necessary for unit test
            importTool.imports(path.join(__dirname, '../../imports/admin-init.json'));

        }

        let firstSetup = true;
        if (!context().__server) {
            let server: Server = context().__server = new Server(config);
            run(() => {
                server.init();
            }).catch(err => {
                done(err);
            });
            server.on('initialized', function () {
                run(() => {
                    console.log("========== Server initialized ============\n");
                    server.start(port);
                }).catch(err => {
                    done(err);
                });
            });
            server.on('started', function () {
                run(() => {
                    console.log("========== Server started ============\n");
                    reset();
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        } else {
            run(() => {
                firstSetup = false;
                reset();
                done();
            }).catch(err => {
                done(err);
            });
        }
        //
        return context().__server;
    }
}





