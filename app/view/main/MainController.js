/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('cardioCatalogQT.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-view',


    requires: [
        'Ext.window.MessageBox'
    ],

    onClickButton: function () {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onExecuteClick: function (button) {
        var auth = sessionStorage.sessionToken + ':unknown',
            hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth),
            panel = button.up('form'),
            json = [],
            records = [],
            payload = Ext.getStore('Payload'),
            url,
            store = Ext.create('Ext.data.Store',{
                fields: [
                    'attribute',
                    'sid',
                    'value',
                    'N',
                    'source'
                ],
                data: records,
                paging: false
            });

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('component: ');
            console.log(panel);
        }

        // construct URL and submit criteria to Query store
        if (payload.getCount() > 0) {
            cardioCatalogQT.service.UtilityService.url(payload);
        }
        // get url
        url = cardioCatalogQT.service.UtilityService.url_request();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

        panel.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        // send auth header before Ajax request to disable auth form
        Ext.Ajax.on('beforerequest', (function(klass, request) {
            if (request.failure) { // already have auth token: do nothing
                return null;
            }
            else { // send auth token
                return request.headers.Authorization = hash;
            }
        }), this);

        Ext.Ajax.request({
            cors: true,
            url: url,
            useDefaultXhrHeader: false,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,
            success: function(response) {
                json = Ext.decode(response.responseText);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('json' + json);
                }

                if(json !== null &&  typeof (json) !==  'undefined'){

                    Ext.each(json, function(entry) {
                        Ext.each(json.items || [], function(tuple) {

                            records.push({
                                N: tuple[0].N,
                                sid: tuple[0].sid,
                                source: tuple[0].source
                            });
                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log(tuple[0].source
                                + 'N ' + tuple[0].N
                                + 'attribute ' + tuple[0].attribute
                                + 'sid ' + tuple[0].sid
                                + 'value ' + tuple[0].value);
                            }
                        });
                    });
                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(records);
                    }

                    //update store with data
                    store.add(records);
                }
                // render template
                cardioCatalogQT.service.UtilityService.template(panel, store);
                // clear criteria from store
                cardioCatalogQT.service.UtilityService.clear_all();
            }
        });
    },

    onSubmitDemographics: function (button) {
        var payload = Ext.getStore('Payload'),
            demo = [],
            form = button.up('form'),
            sexValue = form.down('#sexValue').value,
            ageComparator = form.down('#ageComparator').value,
            ageValue = form.down('#ageValue').value,
            upperAge = form.down('#upperAge').value;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object demographics');
            console.log(sexValue);
            console.log(ageComparator);
            console.log(ageValue);
            console.log(upperAge);
        }

        // insert sex only if exists
        if (sexValue) {

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAge) ||

                (ageComparator !== 'bt' &&
                ageValue &&
                !upperAge) ||

                (ageComparator !== 'bt' &&
                !ageValue &&
                !upperAge)) {

                payload.add({
                    type: 'sex',
                    key: 'sex',
                    comparator: 'eq',
                    value: sexValue
                });

                payload.sync();
            }
            else {

                // error conditionals here
            }
        }

        // insert only if exists
        if (ageValue) {

            var test_age = ageValue;

            if (ageComparator === 'bt') {

                if (!upperAge) {
                    alert('Please enter max age to continue')
                }
                else {
                    test_age += ',' + upperAge;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test age: ' + test_age);
            }

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAge) ||

                (!upperAge &&
                ageComparator !== 'bt' &&
                ageValue)) {

                payload.add({
                    type: 'age',
                    key: 'age',
                    comparator: ageComparator,
                    value: test_age
                });

                payload.sync();
            }
            else{
                // error conditions here
            }
        }

        if (cardioCatalogQT.config.mode === 'test') {
            demo.push(sexValue);
            demo.push(ageComparator);
            demo.push(ageValue);
            demo.push(upperAge);
            console.log('demographics:');
            console.log(demo);
        }
    },

    onSubmitVitals: function(button) {
        var payload = Ext.getStore('Payload'),
            vitals = [],
            form = button.up('form'),
            systolicComparator = form.down('#systolicComparator').value,
            systolicValue = form.down('#systolicValue').value,
            diastolicComparator = form.down('#diastolicComparator').value,
            diastolicValue = form.down('#diastolicValue').value;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object vitals');
            console.log(systolicComparator);
            console.log(systolicValue);
            console.log(diastolicComparator);
            console.log(diastolicValue);
        }

        // insert only if exists
        if (systolicValue) {

            payload.add({
                type: 'blood_pressure_systolic',
                key: 'blood_pressure_systolic',
                comparator: systolicComparator,
                value: systolicValue
            });

            payload.sync();
        }

        // insert only if exists
        if (diastolicValue) {

            payload.add({
                type: 'blood_pressure_diastolic',
                key: 'blood_pressure_diastolic',
                comparator: diastolicComparator,
                value: diastolicValue
            });

            payload.sync();
        }

        if (cardioCatalogQT.config.mode === 'test') {
            vitals.push(systolicComparator);
            vitals.push(systolicValue);
            vitals.push(diastolicComparator);
            vitals.push(diastolicValue);
            console.log('vitals');
            console.log(vitals);
        }
    },

    onSubmitLabs: function (button) {
        var payload = Ext.getStore('Payload'),
            lab = [],
            form = button.up('form'),
            labComparator = form.down('#labComparator').value,
            labCode = form.down('#labCode').value,
            labValue = form.down('#labValue').value,
            upperLab = form.down('#upperLab').value;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object vitals');
            console.log(labComparator);
            console.log(labCode);
            console.log(labValue);
            console.log(upperLab);
        }

        // insert only if exists
        if (labValue) {

            var test_lab = labValue

            if (labComparator === 'bt') {

                if (!upperLab) {
                    alert('Please enter max lab to continue')
                }
                else {
                    test_lab += ',' + upperLab;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test age: ' + test_lab);
            }

            if ((labComparator === 'bt' &&
                labValue &&
                upperLab) ||

                (!upperLab &&
                labComparator !== 'bt' &&
                labValue)) {

                payload.add({
                    type: 'lab',
                    key: labCode,
                    value: test_lab,
                    comparator: labComparator
                });

                payload.sync();
            }
            else{
                // error conditions here
            }
        }

        if (cardioCatalogQT.config.mode === 'test') {
            lab.push(labCode); // type
            lab.push(labComparator); // comparator
            lab.push(labValue); // comparator
            lab.push(upperLab); // comparator
            console.log('labs:');
            console.log(lab);
        }

        payload.sync();
    },

    onSubmitDiagnoses: function(button) {
        var payload = Ext.getStore('Payload'),
            dx = [],
            form = button.up('form'),
            diagnoses = form.down('#diagnosis').store.data.items;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(diagnoses);
        }

        Ext.Array.each(diagnoses, function (item) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'dx',
                key: 'dx_code',
                comparator: 'eq',
                value: item.data.code,
                description: item.data.description
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                dx.push(item.data.code,item.data.description);
                console.log('dx');
                console.log(dx);
                console.log(payload);
            }

        }); // each()
    },

    onSubmitProcedures: function(button) {
        var payload = Ext.getStore('Payload'),
            px = [],
            form = button.up('form'),
            procedures = form.down('#procedure').store.data.items;

        // begin test Rx
        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(procedures);
        }

        Ext.Array.each(procedures, function (item) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'px',
                key: 'px_code',
                comparator: 'eq',
                value: item.data.code,
                description: item.data.description
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                px.push(item.data.code,item.data.description);
                console.log('px');
                console.log(px);
                console.log(payload);
            }

        }); // each()
    },

    onSubmitMedications: function(button) {
        var payload = Ext.getStore('Payload'),
            rx = [],
            form = button.up('form'),
            medications = form.down('#medication').store.data.items;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Rx:');
            console.log(medications);
        }

        Ext.Array.each(medications, function (item) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'rx',
                key: 'rx_code',
                comparator: 'eq',
                value: item.data.code,
                description: item.data.description
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                rx.push(item.data.code,item.data.description);
                console.log('rx');
                console.log(rx);
                console.log(payload);
            }

        }); // each()
    }

});
