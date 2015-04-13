/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('cardioCatalogQT.Application', {
    extend: 'Ext.app.Application',
    
    name: 'cardioCatalogQT',

    stores: [
        'Diagnoses',
        'Labs',
        'Medications',
        'Procedures',
        'Payload',
        'Queries'
    ],
    requires: [
        'Ext.app.*',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'cardioCatalogQT.*',
        'Ext.form.Panel',
        'Ext.ux.form.MultiSelect',
        'Ext.ux.form.ItemSelector',
        'cardioCatalogQT.service.UtilityService',
        'cardioCatalogQT.service.Base64'
    ],

    //autoCreateViewport: true,

    // create a reference in Ext.application so we can access it from multiple functions
    splashscreen: {},

    init: function() {
        // start the mask on the body and get a reference to the mask
       // splashscreen = Ext.getBody().mask('Loading cardioCatalogQT, please stand by ...', 'splashscreen');

    },

    launch: function () {

        Ext.Loader.setConfig({enabled: true});
        Ext.Loader.setPath('Ext.ux', 'Library/JavaScript/ext-js-5.1.0/examples/ux');

        cardioCatalogQT.config = {

            mode: 'test', // switch to control use of staging or production server
            protocol: 'http://',
            host: 'imagelibrary.ahc.umn.edu',
            apiClinical: '/api/clinical/',
            apiPhi: '/api/phi/',
            apiAggregate: '/api/aggregate/',
            apiLogin: '/api/token',
            apiResource: '/api/resource',
            apiFactor: '/api/factor',
            apiGetQ: '/api/getQ/',
            callingFrom: ''

        };

      /*  Ext.tip.QuickTipManager.init();
        var task = new Ext.util.DelayedTask(function() {

            // fade out the body mask
            splashscreen.fadeOut({
                duration: 500,
                remove: true
            });

            // fade out the message
            splashscreen.next().fadeOut({
                duration: 500,
                remove: true
            });
        });

        task.delay(1000); */

        // TODO - Launch the application

        Ext.onReady(function () {

        });
    }


});
