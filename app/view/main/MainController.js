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
        cardioCatalogQT.service.UtilityService.url(payload, button);

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
                n: rec.data.n,
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
        //var url;

        // create and submit url
        cardioCatalogQT.service.UtilityService.url(button);

    },

    onShowClick: function (button) {
        var panel = button.up('form').up().down('#results'),
            store = Ext.getStore('Payload');
        // render template
        cardioCatalogQT.service.UtilityService.criteria_template(panel, store);

    },

    onSubmitDemographics: function (button) {
        var payload = Ext.getStore('Payload'),
            atom,
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
                    type: 'Demographics',
                    key: 'sex',
                    comparator: 'eq',
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash('eq'),
                    value: sexValue,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom('sex', 'sex', 'eq', sexValue)
                });

                payload.sync();

                console.log('atom:' + cardioCatalogQT.service.UtilityService.make_atom('sex', 'sex', 'eq', sexValue));

                atom = cardioCatalogQT.service.UtilityService.make_atom('sex', 'sex', 'eq', sexValue);
                cardioCatalogQT.service.UtilityService.url(button, atom);
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
                    type: 'Demographics',
                    key: 'age',
                    comparator: ageComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(ageComparator),
                    value: test_age,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom('age', 'age', ageComparator, test_age)
                });

                payload.sync();

                atom = cardioCatalogQT.service.UtilityService.make_atom('age', 'age', ageComparator, test_age);
                cardioCatalogQT.service.UtilityService.url(button, atom);
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
        var payload = Ext.getStore('Payload'),
            atom,
            vitals = [],
            form = button.up('grid'),
            measureCode = form.down('#measureCode').value,
            measureComparator = form.down('#measureComparator').value,
            measureValue = form.down('#measureValue').value,
            upperMeasureValue = form.down('#upperMeasureValue').value,
            whenComparator = form.down('#whenComparator').value,
            whenValue = form.down('#whenValue').value,
            upperWhenValue = form.down('#upperWhenValue').value,
            criterion,
            date_comparator;

        whenValue = Ext.Date.format(whenValue, 'Y-m-d');
        upperWhenValue = Ext.Date.format(upperWhenValue, 'Y-m-d');

        date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('date comparator ');
            console.log(date_comparator);
            console.log('show object vitals');
            console.log(measureCode);
            console.log(measureComparator);
            console.log(measureValue);
            console.log(whenComparator);
            console.log(whenValue);
            console.log(upperWhenValue);
        }

        if (measureValue) {

            var test_measure = measureValue,
                test_date = whenValue;

            if (whenComparator === 'bt') {

                if (!upperWhenValue) {
                    alert('Please enter max date to continue')
                }
                else {
                    test_date += ',' + upperWhenValue;
                }
            }

            if (measureComparator === 'bt') {

                if (!upperMeasureValue) {
                    alert('Please enter max measure to continue')
                }
                else {
                    test_measure += ',' + upperMeasureValue ;
                }
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('test measure : ' + test_measure);
                console.log('test date: ' + test_date);
                console.log('measure' + measureValue);
                console.log('measureComp' + measureComparator);
                console.log('measureUpper' + upperMeasureValue);
                console.log('when ' + whenValue);
                console.log('whenComp' + whenComparator);
                console.log('whenUpper' + upperWhenValue);
            }

            // insert only if exists
            if ((measureComparator === 'bt' &&
                measureValue &&
                upperMeasureValue) ||

                (!upperMeasureValue &&
                measureComparator !== 'bt' &&
                measureValue) ||

                (!measureValue)) {

                criterion = measureCode.toUpperCase() +
                    ' ' +
                    cardioCatalogQT.service.UtilityService.comparator_hash(measureComparator) +
                    ' ' +
                    test_measure;


                if (test_date){
                    criterion += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                        + test_date;
                }

                // TODO: implement atomic_unit builder at time of model instance creation
                payload.add({
                    type: measureCode,
                    key: measureCode,
                    comparator: measureComparator,
                    comparatorSymbol: cardioCatalogQT.service.UtilityService.comparator_hash(measureComparator),
                    value: test_measure,
                    dateComparator: whenComparator,
                    dateComparatorSymbol: cardioCatalogQT.service.UtilityService.date_comparator_hash(whenComparator),
                    dateValue: test_date,
                    criteria: criterion,
                    atom: cardioCatalogQT.service.UtilityService.make_atom(measureCode, measureCode, measureComparator, test_measure, whenComparator, test_date)
                });

                payload.sync();

                atom = cardioCatalogQT.service.UtilityService.make_atom(measureCode, measureCode, measureComparator, test_measure, whenComparator, test_date);
                cardioCatalogQT.service.UtilityService.url(button, atom);
            }

            else {
                // error conditions here
            }

            if (cardioCatalogQT.config.mode === 'test') {
                vitals.push(measureComparator);
                vitals.push(measureValue);
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
        var payload = Ext.getStore('Payload'),
            atom,
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
                        atom: cardioCatalogQT.service.UtilityService.make_atom('lab', labCode, labComparator, test_lab, whenComparator, test_date)
                    });
                    payload.sync();

                    atom = cardioCatalogQT.service.UtilityService.make_atom('lab', labCode, labComparator, test_lab, whenComparator, test_date);
                    cardioCatalogQT.service.UtilityService.url(button, atom);
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
        var payload = Ext.getStore('Payload'),
            atom,
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
                atom: cardioCatalogQT.service.UtilityService.make_atom('dx', 'dx_code', 'eq' , item.data.code, whenComparator, test_date)
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                dx.push(item.data.code,item.data.description);
                console.log('dx');
                console.log(dx);
                console.log(payload);
            }

            atom = cardioCatalogQT.service.UtilityService.make_atom('dx', 'dx_code', 'eq' , item.data.code, whenComparator, test_date);
            cardioCatalogQT.service.UtilityService.url(button, atom);

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
        var payload = Ext.getStore('Payload'),
            atom,
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
                atom: cardioCatalogQT.service.UtilityService.make_atom('px', 'px_code', 'eq' , item.data.code, whenComparator, test_date)
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                px.push(item.data.code,item.data.description);
                console.log('px');
                console.log(px);
                console.log(payload);
            }

            atom = cardioCatalogQT.service.UtilityService.make_atom('px', 'px_code', 'eq' , item.data.code, whenComparator, test_date);
            cardioCatalogQT.service.UtilityService.url(button, atom);

        }); // each()
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        form.up().down('#procedureGrid').getStore().load();
        form.up().down('#diagnosisGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSubmitMedications: function(button) {
        var payload = Ext.getStore('Payload'),
            atom,
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
                atom: cardioCatalogQT.service.UtilityService.make_atom('rx', 'rx_code', 'eq' , item.data.code, whenComparator, test_date)
            });

            payload.sync();

            if (cardioCatalogQT.config.mode === 'test') {
                rx.push(item.data.code,item.data.description);
                console.log('rx');
                console.log(rx);
                console.log(payload);
            }

            atom = cardioCatalogQT.service.UtilityService.make_atom('rx', 'rx_code', 'eq' , item.data.code, whenComparator, test_date);
            cardioCatalogQT.service.UtilityService.url(button, atom);

        }); // each()
        // reload store on grid
        //form.up().down('#searchGrid').getStore().load();

        form.up().down('#medicationGrid').getStore().load();
        form.up().down('#diagnosisGrid').getStore().load();
        // clear form
        //form.reset();
    },

    onSubmitSaved: function(button) {
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            payload = Ext.getStore('Payload'),
            atom,
            filtered = [],
            source = grid.store;


        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function (rec) {
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

        //grid.getStore().load();

        // bind grid store as source
        //source = grid.store;


        source.each(function (rec) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log(rec)
            }

            payload.add({
                type: 'saved',
                key: rec.data.query_name,
                description: rec.data.criteria,
                criteria: rec.data.criteria,
                atom: rec.data.molecule
            });

            atom = rec.data.molecule;

            payload.sync();

            cardioCatalogQT.service.UtilityService.url(button, atom, 'submitSaved');

        }); // each()

        //grid.getStore().reload();

    },

    // custom control of toggling disabled status of form buttons
    // control which buttons being toggled by looking at store to which selected object is bound
    onSelectionChange: function(selections, sm) {

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('sm:');
            console.log(selections);
            console.log(selections.selected.items);
            console.log(Ext.ComponentQuery.query('#removeButton').length);
            console.log(Ext.ComponentQuery.query('#andButton').length);
            console.log(Ext.ComponentQuery.query('#orButton').length);
            console.log(Ext.ComponentQuery.query('#notButton').length);
            console.log(Ext.ComponentQuery.query('#searchSelected'));

        }

        // control for disabling button on SavedQueries;
        if (selections.store.id.indexOf('queries') > -1) {
            if (Ext.ComponentQuery.query('#searchSelected')[0].disabled === true) {

                Ext.ComponentQuery.query('#searchSelected')[0].enable();
            }
            if (selections.selected.length === 0) {

                Ext.ComponentQuery.query('#searchSelected')[0].disable();
            }
        }

        // control for disabling buttons on category tab grids
        else {

            for (var i = 0, max = Ext.ComponentQuery.query('#removeButton').length; i < max; i++) {

                // Activate controls
                if (Ext.ComponentQuery.query('#removeButton')[i].disabled === true &&
                    Ext.ComponentQuery.query('#clearFilter')[i].disabled === true &&
                    Ext.ComponentQuery.query('#saveQuery')[i].disabled === true &&
                    selections.selected.length > 0) {

                    Ext.ComponentQuery.query('#removeButton')[i].enable();
                    Ext.ComponentQuery.query('#clearFilter')[i].enable();
                    Ext.ComponentQuery.query('#saveQuery')[i].enable();

                }
                if (Ext.ComponentQuery.query('#andButton')[i].disabled === true &&
                    Ext.ComponentQuery.query('#orButton')[i].disabled === true &&
                    selections.selected.length > 1) {

                    Ext.ComponentQuery.query('#andButton')[i].enable();
                    Ext.ComponentQuery.query('#orButton')[i].enable();
                }
                if (Ext.ComponentQuery.query('#notButton')[i].disabled === true &&
                    selections.selected.length === 1) {

                    Ext.ComponentQuery.query('#notButton')[i].enable();
                }

                // Deactivate controls
                if (selections.selected.length > 1 || selections.selected.length === 0) {

                    Ext.ComponentQuery.query('#notButton')[i].disable();
                }
                if (selections.selected.length < 2) {

                    Ext.ComponentQuery.query('#andButton')[i].disable();
                    Ext.ComponentQuery.query('#orButton')[i].disable();
                }
                if (selections.selected.length === 0) {

                    Ext.ComponentQuery.query('#removeButton')[i].disable();
                    Ext.ComponentQuery.query('#clearFilter')[i].disable();
                    Ext.ComponentQuery.query('#saveQuery')[i].disable();
                }

            }
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
            },
            grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection();

        if (selection.length > 1) {
            cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
        }
        else {
            alert('You need more than 1 expression!')
        }
    },

    onCriterionAnd: function (button) {
        var options = {
                delimiter: '&'
            },
            grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection();

        if (selection.length > 1) {
            cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
        }
        else {
            alert('You need more than 1 expression!')
        }
    },

    onCriterionNot: function (button) {
        var options = {
                delimiter: '~'
            },
            grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection();

        console.log(selection.length);

        if (selection.length === 1) {
            cardioCatalogQT.service.UtilityService.assemble_boolean(button, options);
        }
        else {
            alert('You can only exclude 1 expression at a time!')
        }
    },

    onFilterSave: function (button) {

        cardioCatalogQT.service.UtilityService.query_move(button);
    },

    onFilterRetrieve: function (button) {

        cardioCatalogQT.service.UtilityService.query_get(button);
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
    },

    onShowTab : function() {
        var mainView   = this.getMainView();
        var resultView = this.getExportTab();


        // enable the export view
        resultView.enable();


        mainView.setActiveItem(exportView);
    }

});
