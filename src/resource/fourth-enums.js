const enumsModuleLocation = window.sessionStorage.getItem("ttcEnums");
fourth.enums = import(enumsModuleLocation).then(module => module.default);
