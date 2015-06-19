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

    onExecuteClick: function (button) {
        var options = {
            delimiter: null
        },
            payload = Ext.getStore('Payload'),
            url,
            form = button.up('form');

        // construct URL and submit criteria to Query store
        if (payload.getCount() > 0) {
            url = cardioCatalogQT.service.UtilityService.url(payload, options);
        }
        // if no criteria have been selected then run the last generated query
        else {
            url = cardioCatalogQT.service.UtilityService.url_request();
        }

        cardioCatalogQT.service.UtilityService.submit_query(button, url);

        form.up().down('#searchGrid').getStore().load();
    },

    onAddSearchGridClick: function (button) {
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            target = Ext.create('cardioCatalogQT.store.Payload'), // target store
            source, // source store
            filtered = []; // array of filtered source id elements

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('DEMO grid: ');
            console.log(grid);
            console.log(grid.store);
            console.log(grid.store.storeId); // use for control of inserting boolean combined statements
        }

        // bind grid store as source
        source = grid.store;

        // filter selected items from grid
        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store id:');
                console.log(filtered);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }

        // add filtered source -> target
        source.each(function(rec) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('record:');
                console.log(rec);
            }

            // move selected criteria to main payload: TODO create single class to handle payload
            target.add({
                type: rec.data.type,
                key: rec.data.key,
                comparator: rec.data.comparator,
                comparatorSymbol: rec.data.comparatorSymbol,
                value: rec.data.value,
                description: rec.data.criteria,
                //n: rec.data.n,
                dateComparator: rec.data.dateComparator,
                dateComparatorSymbol: rec.data.dateComparatorSymbol,
                dateValue: rec.data.dateValue,
                atom: rec.data.atom,
                criteria: rec.data.criteria
            });

            target.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('target rec');
                console.log(rec);
            }

        });

        // refresh grid
        grid.up().down('#searchGrid').getStore().load();
    },

    onSearchClick: function (button) {
        var url;

        // get last submitted url
        url = cardioCatalogQT.service.UtilityService.url_request();

        cardioCatalogQT.service.UtilityService.submit_query(button, url);
    },

    onShowClick: function (button) {
        var panel = button.up('form').up().down('#results'),
            store = Ext.getStore('Payload');
        // render template
        cardioCatalogQT.service.UtilityService.criteria_template(panel, store);
    },

    onSubmitDemographics: function (button) {
        var payload = Ext.getStore('DemographicsPayload'),
            demo = [],
            form = button.up('grid'),
            sexValue = form.down('#sexValue').value,
            ageComparator = form.down('#ageComparator').value,
            ageValue = form.down('#ageValue').value,
            upperAgeValue = form.down('#upperAgeValue').value,
            criterion;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object demographics');
            console.log(sexValue);
            console.log(ageComparator);
            console.log(ageValue);
            console.log(upperAgeValue);
        }

        // insert sex only if exists
        if (sexValue) {

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAgeValue) ||

                (ageComparator !== 'bt' &&
                ageValue &&
                !upperAgeValue) ||

                (ageComparator !== 'bt' &&
                !ageValue &&
                !upperAgeValue)) {

                // TODO: implement citerion builder independent of all data in stores
                criterion = 'SEX' +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash('eq') +
                    ' ' +
                    sexValue;

                // TODO: implement atomic_unit builder at time of model instance creation

                payload.add({
                    type: 'sex',
                    key: 'sex',
                    comparator: 'eq',
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                    value: sexValue,
                    criteria: criterion,
                    atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('sex', 'sex', 'eq', sexValue) + ')'
                });

                payload.sync();

                console.log('atom:' + cardioCatalogQT.service.UtilityService.make_atom('sex', 'sex', 'eq', sexValue))
            }
            else {

                // error conditionals here
            }
        }

        // insert only if exists
        if (ageValue) {

            var test_age = ageValue;

            if (ageComparator === 'bt') {

                if (!upperAgeValue) {
                    alert('Please enter max age to continue')
                }
                else {
                    test_age += ',' + upperAgeValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test age: ' + test_age);
            }

            if ((ageComparator === 'bt' &&
                ageValue &&
                upperAgeValue) ||

                (!upperAgeValue &&
                ageComparator !== 'bt' &&
                ageValue)) {

                // TODO: implement citerion builder independent of all data in stores
                criterion = 'Age' +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator) +
                    ' ' +
                    test_age;

                // TODO: implement atomic_unit builder at time of model instance creation

                payload.add({
                    type: 'age',
                    key: 'age',
                    comparator: ageComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator),
                    value: test_age,
                    criteria: criterion,
                    atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('age', 'age', ageComparator, test_age) + ')'
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
            demo.push(upperAgeValue);
            console.log('demographics:');
            console.log(demo);
        }

        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
        form.up().down('#demographicGrid').getStore().load();

        // clear form
        //form.reset();
    },

    onSubmitVitals: function(button) {
        var payload = Ext.getStore('VitalsPayload'),
            vitals = [],
            form = button.up('grid'),
            systolicComparator = form.down('#systolicComparator').value,
            systolicValue = form.down('#systolicValue').value,
            upperSystolicValue = form.down('#upperSystolicValue').value,
            diastolicComparator = form.down('#diastolicComparator').value,
            diastolicValue = form.down('#diastolicValue').value,
            upperDiastolicValue = form.down('#upperDiastolicValue').value,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

        whenValue = Ext.Date.format(whenValue, 'Y-m-d');
        upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');

        date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('query comparator ');
            console.log(systolicComparator);
            console.log('date comparator ');
            console.log(date_comparator);

        }


        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object vitals');
            console.log(systolicComparator);
            console.log(systolicValue);
            console.log(diastolicComparator);
            console.log(diastolicValue);
            console.log(whenComparator);
            console.log(whenValue);
            console.log(upperWhenValue);
        }

        if (systolicValue || diastolicValue) {

            var test_systolic = systolicValue,
                test_diastolic = diastolicValue,
                test_date = whenValue;


            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }


            if (systolicComparator === 'bt') {

                if (!upperSystolicValue) {
                    alert('Please enter max systolic to continue')
                }
                else {
                    test_systolic += ',' + upperSystolicValue ;
                }
            }

            if (diastolicComparator === 'bt') {

                if (!upperDiastolicValue) {
                    alert('Please enter max diastolic to continue')
                }
                else {
                    test_diastolic += ',' + upperDiastolicValue;
                }
            }


            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test systolic : ' + test_systolic);
                console.log('test diastolic: ' + test_diastolic);
                console.log('test date: ' + test_date);
                console.log('systolic' + systolicValue);
                console.log('systolicComp' + systolicComparator);
                console.log('systolicUpper' + upperSystolicValue);
                console.log('diastolic' + systolicValue);
                console.log('diastolicComp' + systolicComparator);
                console.log('diastolicUpper' + upperSystolicValue);
                console.log('when ' + whenValue);
                console.log('whenComp' + whenComparator);
                console.log('whenUpper' + upperWhenValue);

            }

            // insert only if exists
            if (((systolicComparator === 'bt' &&
                systolicValue &&
                upperSystolicValue) ||

                (!upperSystolicValue &&
                systolicComparator !== 'bt' &&
                systolicValue) ||

                (!systolicValue)) &&

                ((diastolicComparator === 'bt' &&
                diastolicValue &&
                upperDiastolicValue) ||

                (!upperDiastolicValue &&
                diastolicComparator !== 'bt' &&
                diastolicValue) ||

                (!diastolicValue))) {

                if (systolicValue) {

                    // TODO: implement citerion builder independent of all data in stores
                    criterion = 'BLOOD_PRESSURE_SYSTOLIC' +
                        ' ' +
                        cardioCatalogQT.service.UtilityService.comparator_hash(systolicComparator) +
                        ' ' +
                        test_systolic;


                    if (test_date){
                        criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                            + test_date;
                    }

                    // TODO: implement atomic_unit builder at time of model instance creation
                    payload.add({
                        type: 'blood_pressure_systolic',
                        key: 'blood_pressure_systolic',
                        comparator: systolicComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(systolicComparator),
                        value: test_systolic,
                        dateComparator: whenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator),
                        dateValue: test_date,
                        criteria: criterion,
                        atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('blood_pressure_systolic', 'blood_pressure_systolic', systolicComparator, test_systolic, whenComparator, test_date) + ')'
                    });

                    payload.sync();
                }

                if (diastolicValue) {

                    criterion = 'BLOOD_PRESSURE_DIASTOLIC' +
                        ' ' +
                        cardioCatalogQT.service.UtilityService.comparator_hash(diastolicComparator) +
                        ' ' +
                        test_diastolic;

                    if (test_date){
                        criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                        + test_date;
                    }

                    payload.add({
                        type: 'blood_pressure_diastolic',
                        key: 'blood_pressure_diastolic',
                        comparator: diastolicComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(diastolicComparator),
                        value: test_diastolic,
                        dateComparator: whenComparator,
                        dateComparatorSymbol: cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator),
                        dateValue: test_date,
                        criteria: criterion,
                        atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('blood_pressure_systolic', 'blood_pressure_systolic', diastolicComparator, test_diastolic, whenComparator, test_date) + ')'
                    });
                    payload.sync();
                }
            }
            else {
                // error conditions here
            }

            if (cardioCatalogQT.config.mode === 'test') {
                vitals.push(systolicComparator);
                vitals.push(systolicValue);
                vitals.push(diastolicComparator);
                vitals.push(diastolicValue);
                console.log('vitals');
                console.log(vitals);
            }
        }
     // reload store on grid
        form.up().down('#searchGrid').getStore().load();
        form.up().down('#vitalGrid').getStore().load();

        // clear form
        //form.reset();
    },

    onSubmitLabs: function (button) {
        var payload = Ext.getStore('LabsPayload'),
            lab = [],
            form = button.up('grid'),
            labComparator = form.down('#labComparator').value,
            labCode = form.down('#labCode').value,
            labDescription = form.down('#labCode').rawValue,
            labValue = form.down('#labValue').value,
            upperLabValue = form.down('#upperLabValue').value,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

        whenValue = Ext.Date.format(whenValue, 'Y-m-d');
        upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d'),

        date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show object labs');
            console.log(form.down('#labCode'));
            console.log(labComparator);
            console.log(labCode);
            console.log(labValue);
            console.log(upperLabValue);
        }

        // insert only if exists
        if (labValue) {


            var test_lab = labValue,
                test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (labComparator === 'bt') {

                if (!upperLabValue) {
                    alert('Please enter max lab to continue')
                }
                else {
                    test_lab += ',' + upperLabValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test lab : ' + test_lab);
            }

            if (((labComparator === 'bt' &&
                labValue &&
                upperLabValue) ||

                (!upperLabValue &&
                labComparator !== 'bt' &&
                labValue))) {

                // TODO: implement citerion builder independent of all data in stores
                criterion =  labCode +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(labComparator) +
                    ' ' +
                    test_lab;

                if (test_date){

                    criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                        + test_date;
                }
                if (labValue) {
                    payload.add({
                        type: 'lab',
                        key: labCode,
                        value: test_lab,
                        comparator: labComparator,
                        comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(labComparator).toUpperCase(),
                        description: labDescription,
                        dateComparator: whenComparator,
                        dateComparatorSymbol: date_comparator,
                        dateValue: test_date,
                        criteria: criterion,
                        atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('lab', 'lab', labComparator, test_lab, whenComparator, test_date) + ')'
                    });
                    payload.sync();
                }
                else {
                    // error conditions here
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                lab.push(labCode); // type
                lab.push(labComparator); // comparator
                lab.push(labValue); // comparator
                lab.push(upperLabValue); // comparator
                console.log('labs:');
                console.log(lab);
            }

        }
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
        form.up().down('#labGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSubmitDiagnoses: function(button) {
        var payload = Ext.getStore('DiagnosesPayload'),
            dx = [],
            form = button.up('grid'),
            diagnoses = form.down('#diagnosis').store.data.items,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

            whenValue = Ext.Date.format(whenValue, 'Y-m-d');
            upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(diagnoses);
        }

        Ext.Array.each(diagnoses, function (item) {

            var test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: implement citerion builder independent of all data in stores
            criterion =  item.data.description;

            if (test_date){
                criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                + test_date;
            }
            // TODO: ensure record does not already exist
            payload.add({
                type: 'dx',
                key: 'dx_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: whenComparator,
                dateComparatorSymbol: date_comparator,
                dateValue: test_date,
                criteria: criterion,
                atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('dx', 'dx_code', 'eq' , item.data.code, whenComparator, test_date) + ')'
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                dx.push(item.data.code,item.data.description);
                console.log('dx');
                console.log(dx);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        // reload store on grid
        form.up().down('#searchGrid').getStore().load();
        form.up().down('#diagnosisGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSubmitProcedures: function(button) {
        var payload = Ext.getStore('ProceduresPayload'),
            px = [],
            form = button.up('grid'),
            procedures = form.down('#procedure').store.data.items,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

            whenValue = Ext.Date.format(whenValue, 'Y-m-d');
            upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        // begin test Rx
        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Dx:');
            console.log(procedures);
        }

        Ext.Array.each(procedures, function (item) {

            var test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }
            // TODO: implement citerion builder independent of all data in stores
            criterion =  item.data.description;

            if (test_date){
                criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                + test_date;
            }

            // TODO: ensure record does not already exist
            payload.add({
                type: 'px',
                key: 'px_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: whenComparator,
                dateComparatorSymbol: date_comparator,
                dateValue: test_date,
                criteria: criterion,
                atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('px', 'px_code', 'eq' , item.data.code, whenComparator, test_date) + ')'
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                px.push(item.data.code,item.data.description);
                console.log('px');
                console.log(px);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        form.up().down('#procedureGrid').getStore().load();
        form.up().down('#diagnosisGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSubmitMedications: function(button) {
        var payload = Ext.getStore('MedicationsPayload'),
            rx = [],
            form = button.up('grid'),
            medications = form.down('#medication').store.data.items,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

            whenValue = Ext.Date.format(whenValue, 'Y-m-d');
            upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('show submitted Rx:');
            console.log(medications);
        }

        Ext.Array.each(medications, function (item) {

            var test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(item)
            }

            // TODO: implement citerion builder independent of all data in stores
            criterion =  item.data.description;

            if (test_date){
                criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                + test_date;
            }
            // TODO: ensure record does not already exist
            payload.add({
                type: 'rx',
                key: 'rx_code',
                comparator: 'eq',
                comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                value: item.data.code,
                description: item.data.description.toUpperCase(),
                dateComparator: whenComparator,
                dateComparatorSymbol: cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator),
                dateValue: test_date,
                criteria: criterion,
                atom: '(' + cardioCatalogQT.service.UtilityService.make_atom('rx', 'rx_code', 'eq' , item.data.code, whenComparator, test_date) + ')'
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                rx.push(item.data.code,item.data.description);
                console.log('rx');
                console.log(rx);
                console.log(payload);
            }

        }); // each()
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        form.up().down('#medicationGrid').getStore().load();
        form.up().down('#diagnosisGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSelectionChange: function(sm, selections) {
        var store = sm.store.storeId;

        console.log('sm:');
        console.log(sm);
        console.log(sm.store.storeId);

        if (store === 'Payload') {
            this.getReferences().removeButton.setDisabled(selections.length === 0);
        }
        else if (store === 'DemographicsPayload') {
            this.getReferences().removeDemographicButton.setDisabled(selections.length === 0);
        }
        else if (store === 'VitalsPayload') {
            this.getReferences().removeVitalButton.setDisabled(selections.length === 0);
        }
        else if (store === 'LabsPayload') {
            this.getReferences().removeLabButton.setDisabled(selections.length === 0);
        }
        else if (store === 'DiagnosesPayload') {
            this.getReferences().removeDiagnosisButton.setDisabled(selections.length === 0);
        }
        else if (store === 'Proceduresload') {
            this.getReferences().removeMedicationButton.setDisabled(selections.length === 0);
        }
        else if (store === 'MedicationsPayload') {
            this.getReferences().removeProcedureButton.setDisabled(selections.length === 0);
        }

    },

    // TODO: generalize this across all grids
    onCriterionRemove: function (button) {
        var grid = button.up('grid'),
            selection = grid.getView().getSelectionModel().getSelection(),
            store,
            // bind grid store as source
            source = grid.store;

        store = Ext.getStore(source);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(store);
        }

        if (selection) {
            store.remove(selection);
            store.sync();
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('removed')
                console.log(store)
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }
    },


    onCriterionOr: function (button) {
        var options = {
                    delimiter: '|'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    onCriterionAnd: function (button) {
        var options = {
                delimiter: '&'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    onCriterionNot: function (button) {
        var options = {
                delimiter: '~'
            };

        cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
    },

    // TODO: generalize this across all grids
    // clear filter and reload store into grid
    onFilterClear: function (button) {
        var grid = button.up('grid'),
        // bind grid store as source
            source = grid.store,
            store = Ext.getStore(source);

        store.clearFilter();
        grid.getStore().load();
    }

});
