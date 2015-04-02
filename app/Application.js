/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('cardioCatalogQT.Application', {
    extend: 'Ext.app.Application',
    
    name: 'cardioCatalogQT',

    stores: [
        // TODO: add global / shared stores here
        'Diagnoses',
        'Labests',
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
            apiGetQ: '/api/getQ/'

        },

        // TODO - Launch the application

        Ext.onReady(function () {


        });
    }


});
