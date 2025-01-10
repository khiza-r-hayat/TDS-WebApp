import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-redirect',
    standalone: true,
    imports: [],
    templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {
    redirectType = signal<number>(404);

    constructor(private route: ActivatedRoute) {}
    ngOnInit(): void {
        // const data = this.route.firstChild.snapshot.data;
        // console.log(data);
        const route = this.route.firstChild;
        if (route) {
            route.data.subscribe((data) => {
                // console.log(data);
                this.redirectType.set(data['redirectType']);
            });
        }
    }
}
