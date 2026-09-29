import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto';

@Component({
  imports: [FormsModule],
  selector: 'app-productos',
  styleUrl: './productos.css',
  templateUrl: './productos.html',
})
export class Productos implements OnInit {

  productos: Producto[] = [];

  nuevoProducto: Producto = new Producto();

  productoEditandoId: string | null = null;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================================
     INICIALIZACIÓN
     ========================================= */

  ngOnInit(): void {
    this.obtenerProductos();
  }

  /* =========================================
     OBTENER PRODUCTOS
     ========================================= */

  obtenerProductos(): void {

    this.productoService
      .obtenerProductos()
      .subscribe(data => {

        console.log('PRODUCTOS RECIBIDOS:', data);

        this.productos = data;

        this.cdr.detectChanges();
      });
  }

  /* =========================================
     GUARDAR / ACTUALIZAR PRODUCTO
     ========================================= */

  guardarProducto(): void {

    /* =========================================
       ACTUALIZAR PRODUCTO
       ========================================= */

    if (this.productoEditandoId) {

      this.productoService
        .actualizarProducto(
          this.productoEditandoId,
          this.nuevoProducto
        )
        .subscribe(productoActualizado => {

          console.log(
            'Producto actualizado correctamente:',
            productoActualizado
          );

          const indice = this.productos.findIndex(
            producto => producto._id === this.productoEditandoId
          );

          if (indice !== -1) {

            this.productos[indice] = productoActualizado;

            this.productos = [...this.productos];
          }

          this.nuevoProducto = new Producto();

          this.productoEditandoId = null;

          this.cdr.detectChanges();
        });

      return;
    }

    /* =========================================
       CREAR PRODUCTO
       ========================================= */

    this.productoService
      .guardarProducto(this.nuevoProducto)
      .subscribe(productoGuardado => {

        console.log(
          'Producto guardado correctamente:',
          productoGuardado
        );

        this.productos = [
          ...this.productos,
          productoGuardado
        ];

        this.nuevoProducto = new Producto();

        this.cdr.detectChanges();
      });
  }

  /* =========================================
     EDITAR PRODUCTO
     ========================================= */

  editarProducto(producto: Producto): void {

    console.log(
      'Producto seleccionado para editar:',
      producto
    );

    this.productoEditandoId = producto._id ?? null;

    this.nuevoProducto = { ...producto };

    this.cdr.detectChanges();

    /* =========================================
       SUBIR AL FORMULARIO AUTOMÁTICAMENTE
       ========================================= */

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /* =========================================
     CANCELAR EDICIÓN
     ========================================= */

  cancelarEdicion(): void {

    this.nuevoProducto = new Producto();

    this.productoEditandoId = null;

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /* =========================================
     ELIMINAR PRODUCTO
     ========================================= */

  eliminarProducto(producto: Producto): void {

    if (!producto._id) {

      console.error(
        'El producto no tiene un ID válido.'
      );

      return;
    }

    const confirmar = window.confirm(
      `¿Está seguro de que desea eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.productoService
      .eliminarProducto(producto._id)
      .subscribe(() => {

        console.log(
          'Producto eliminado correctamente'
        );

        this.productos = this.productos.filter(
          item => item._id !== producto._id
        );

        this.cdr.detectChanges();
      });
  }
}