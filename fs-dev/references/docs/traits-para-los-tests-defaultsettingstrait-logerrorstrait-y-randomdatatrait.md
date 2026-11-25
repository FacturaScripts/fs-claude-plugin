---
id: 4996
permalink: traits-para-los-tests-defaultsettingstrait-logerrorstrait-y-randomdatatrait
title: Traits para los tests: DefaultSettingsTrait, LogErrorsTrait y RandomDataTrait
creationdate: 12-11-2026 18:14:01
lastmod: 12-11-2026
url: https://facturascripts.com/publicaciones/traits-para-los-tests-defaultsettingstrait-logerrorstrait-y-randomdatatrait
---
FacturaScripts incluye tres traits en la carpeta `Test/Traits` que ahorran mucho trabajo al escribir tests unitarios, tanto del core como de [plugins](https://facturascripts.com/publicaciones/testeo-de-plugins): preparan la base de datos y la configuración, muestran los errores del log cuando un test falla y generan datos de prueba.

- **DefaultSettingsTrait**: crea las tablas del core, carga la configuración predeterminada e instala el plan contable.
- **LogErrorsTrait**: muestra los errores y las consultas SQL cuando un test falla.
- **RandomDataTrait**: genera clientes, productos, facturas y otros modelos con datos aleatorios.

Los tres están en el espacio de nombres `FacturaScripts\Test\Traits` y se añaden a la clase del test con `use`.

## 🧪 Ejemplo completo

```
&lt;?php

namespace FacturaScripts\Test\Plugins;

use FacturaScripts\Test\Traits\DefaultSettingsTrait;
use FacturaScripts\Test\Traits\LogErrorsTrait;
use FacturaScripts\Test\Traits\RandomDataTrait;
use PHPUnit\Framework\TestCase;

class MiTest extends TestCase
{
	use DefaultSettingsTrait;
	use LogErrorsTrait;
	use RandomDataTrait;

	public static function setUpBeforeClass(): void
	{
		// creamos todas las tablas del core
		self::loadCoreModels();

		// cargamos la configuración predeterminada
		self::setDefaultSettings();
	}

	public function testCreate(): void
	{
		// creamos un cliente con datos aleatorios
		$cliente = $this-&gt;getRandomCustomer();
		$this-&gt;assertTrue($cliente-&gt;save(), &#39;cant-save-customer&#39;);

		// eliminamos
		$this-&gt;assertTrue($cliente-&gt;getDefaultAddress()-&gt;delete(), &#39;cant-delete-contact&#39;);
		$this-&gt;assertTrue($cliente-&gt;delete(), &#39;cant-delete-customer&#39;);
	}

	protected function tearDown(): void
	{
		// si el test ha fallado, mostramos los errores del log
		$this-&gt;logErrors();
	}
}
```

## ⚙️ DefaultSettingsTrait
Prepara la base de datos y la configuración. Sus métodos son estáticos, pensados para llamarlos desde `setUpBeforeClass()`.

- **loadCoreModels()**: instancia todos los modelos del core, igual que hace el asistente de inicio, y por tanto crea todas sus tablas. Disponible desde FacturaScripts 2026.
- **setDefaultSettings()**: carga la configuración predeterminada del país por defecto (el archivo `default.json` de `Core/Data/Codpais`) y asigna como almacén predeterminado el de la empresa predeterminada.
- **installAccountingPlan()**: importa el plan contable del país por defecto en todos los ejercicios que no tengan uno. Si un ejercicio está cerrado, lo abre. Necesario para los tests que generan asientos.
- **removeTaxRegularization()**: elimina todas las regularizaciones de impuestos. Una regularización bloqueada impide guardar o eliminar asientos con fecha dentro de su periodo, lo que hace fallar a los tests que generan contabilidad en esas fechas.

### ⚠️ Faltan tablas del core en la base de datos
Es el fallo más habitual en los tests de plugins: el test falla con un error de SQL del tipo «la tabla no existe» sobre una tabla del core, a menudo solo en una base de datos limpia (por ejemplo, en la [GitHub Action](https://facturascripts.com/publicaciones/anadir-una-github-action-para-ejecutar-los-tests-unitarios)) y no en tu instalación de desarrollo.

**¿Por qué ocurre?** FacturaScripts crea cada tabla la primera vez que se instancia su modelo. En una instalación normal, el asistente de inicio carga todos los modelos del core y deja todas las tablas creadas, pero los tests se ejecutan sobre una base de datos en la que nadie ha pasado por el asistente. Si tu test, o una tabla de tu plugin con claves ajenas, necesita una tabla del core cuyo modelo todavía no se ha instanciado, esa tabla no existe.

**Solución:** llama a `self::loadCoreModels()` en el `setUpBeforeClass()` del test, como en el ejemplo de arriba.

Ten en cuenta que `loadCoreModels()` solo carga los modelos del core. Las tablas de tu plugin, o de otros plugins, se crean igualmente al instanciar sus modelos: si el error es sobre una de esas tablas, instancia su modelo al principio del test.

## 🐞 LogErrorsTrait
Cuando un test falla, PHPUnit solo indica qué comprobación no se ha cumplido. Este trait añade lo que FacturaScripts ha registrado en el log, que suele ser lo que explica el fallo.

- **logErrors()**: si el test no ha pasado, muestra por la salida de errores los mensajes `critical`, `error` y `warning` del log, con su contexto. Además guarda todas las consultas SQL ejecutadas en un archivo `MyFiles/test_error_FECHA.log` y muestra las 5 últimas. Después vacía el log, haya fallado el test o no, para que los mensajes de un test no se mezclen con los del siguiente. Con `logErrors(true)` se muestra todo aunque el test haya pasado.
- **searchAuditLog($modelClass, $modelCode)**: devuelve `true` si en el log de auditoría hay un registro de ese modelo y ese código. Sirve para comprobar que una operación ha dejado rastro en la auditoría.

Lo habitual es llamar a `logErrors()` en el `tearDown()`, para que se ejecute después de cada test. Como `logErrors()` vacía el log, llama a `searchAuditLog()` dentro del propio test, no después.

## 🎲 RandomDataTrait
Devuelve modelos del core rellenos con datos aleatorios, para no repetir en cada test el código que los crea.

La mayoría de métodos devuelven el modelo **sin guardar**: tienes que llamar a `save()` tú, lo que permite cambiar antes los campos que necesites.

- **getRandomAccount($codejercicio)**: cuenta contable `9999` del ejercicio indicado.
- **getRandomAgent()**: agente.
- **getRandomCity($idprovincia)**: ciudad de la provincia indicada.
- **getRandomCompany()**: empresa.
- **getRandomContact()**: contacto.
- **getRandomCountry()**: país.
- **getRandomCustomer()**: cliente.
- **getRandomProduct()**: producto.
- **getRandomProvince($codpais)**: provincia del país indicado.
- **getRandomSerie()**: serie.
- **getRandomSupplier()**: proveedor.
- **getRandomTax()**: impuesto.
- **getRandomUser()**: usuario con nick, email y contraseña aleatorios.
- **getRandomWarehouse()**: almacén.

Estos otros sí guardan datos en la base de datos:

- **getRandomCustomerInvoice($date, $codalmacen)**: crea y guarda un cliente y una factura de cliente con una línea, ya calculada. Los dos parámetros son opcionales.
- **getRandomSupplierInvoice($date, $codalmacen)**: lo mismo con un proveedor y una factura de proveedor.
- **getRandomVariant()**: crea y guarda un producto y devuelve una variante suya sin guardar.
- **getRandomExercise()**: devuelve el primer ejercicio que exista; si no hay ninguno, crea el de la fecha actual.

`getRandomContact()`, `getRandomCustomer()` y `getRandomSupplier()` admiten un texto opcional, que se guarda en las observaciones y ayuda a saber qué test creó el registro.

### 🧹 Elimina lo que crees
La base de datos de pruebas se comparte entre todos los tests, así que cada test debe eliminar al terminar todo lo que ha creado, incluido lo que crean estos métodos por debajo. Por ejemplo, tras `getRandomCustomerInvoice()` hay que eliminar la factura, la dirección del cliente y el cliente:

```
$invoice = $this-&gt;getRandomCustomerInvoice();
$subject = $invoice-&gt;getSubject();

// ... comprobaciones ...

$this-&gt;assertTrue($invoice-&gt;delete());
$this-&gt;assertTrue($subject-&gt;getDefaultAddress()-&gt;delete());
$this-&gt;assertTrue($subject-&gt;delete());
```