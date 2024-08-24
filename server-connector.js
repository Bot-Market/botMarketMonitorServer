const pm2 = require('pm2');
const argv = require('minimist')(process.argv.slice(2));

pm2.connect(function(err) {
  if (err) {
    console.error('E: ' + err);
    process.exit(2);
  }
  switch (argv.t) {
    case 'list':
      pm2.list((e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        }

        /* Remove all unused properties in the object to avoid too many data */
        r.forEach((v, i) => {
          const env = r[i].pm2_env;
          r[i].pm2_env = {
            status: env.status,
            pm_uptime: env.pm_uptime,
            pm_cwd: env.pm_cwd,
            pm_log_path: env.pm_log_path
          }

          delete r[i].pid;
        });

        console.log(JSON.stringify(r));
        process.exit(0)
      })
      break;
    case 'stop':
      pm2.stop(argv.id, (e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        } else {
          process.exit(0)
        }
      })
      break;
    case 'restart':
      pm2.restart(argv.id, (e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        } else {
          process.exit(0)
        }
      })
      break;
    case 'describe':
      pm2.describe(argv.id, (e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        } else {
          console.log(JSON.stringify(r))
          process.exit(0)
        }
      })
      break;
    case 'delete':
      pm2.delete(argv.id, (e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        } else {
          process.exit(0)
        }
      })
      break;
    case 'start':
      pm2.start({
        name: argv.name,
        cwd: argv.dir,
        script: argv.script,
        args: ['start'],
        log_file: argv.log
      }, (e, r) => {
        if (e) {
          console.error('E: ' + e);
          process.exit(2)
        } else {
          process.exit(0)
        }
      })
      break;
    default:
      console.log('E: Unknown Action');
      process.exit(2)
  }
});
