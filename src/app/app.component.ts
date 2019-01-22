import { Component, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ViewChild, ViewContainerRef } from '@angular/core';
import * as d3 from 'd3';
import { CommomService } from './commom.service';
import { PopupComponent } from './popup.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chart';
  sampleData = {};
  uStatePaths = [];
  childComponentRef;
  constructor(
    private commomService: CommomService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {

  }
  ngOnInit() {
    this.uStatePaths = this.commomService.getData();
    ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
      "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
      "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
      "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
      "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
      .forEach((d) => {
        var low = Math.round(100 * Math.random()),
          mid = Math.round(100 * Math.random()),
          high = Math.round(100 * Math.random());
        this.sampleData[d] = {
          low: d3.min([low, mid, high]), high: d3.max([low, mid, high]),
          avg: Math.round((low + mid + high) / 3), color: d3.interpolate("#ffffcc", "#800026")(low / 100)
        };
      });
    this.draw("#statesvg");
    d3.select(self.frameElement).style("height", "600px");
  }

  draw(id) {
    d3.select(id).selectAll(".state")
      .data(this.uStatePaths).enter().append("path").attr("class", "state").attr("d", function (d) { return d.d; })
      .style("fill", (d) => { return this.sampleData[d.id].color; })
      .on("mouseover", (d) => this.mouseOver(d)).on("mouseout", () => this.mouseOut());
  }

  mouseOver(d) {
    if (this.childComponentRef) {
      this.appRef.detachView(this.childComponentRef.hostView);
      this.childComponentRef.destroy();
    }
    this.childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(PopupComponent)
      .create(this.injector);
    this.appRef.attachView(this.childComponentRef.hostView);
    const childDomElem = (this.childComponentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    d3.select("#tooltip").transition().duration(200).style("opacity", .9);
    d3.select("#tooltip").html(childDomElem.innerHTML)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  }

  mouseOut() {
    d3.select("#tooltip").transition().duration(500).style("opacity", 0);
  }


  tooltipHtml(n, d) {
    return "<h4>" + n + "</h4><table>" +
      "<tr><td>Low</td><td>" + (d.low) + "</td></tr>" +
      "<tr><td>Average</td><td>" + (d.avg) + "</td></tr>" +
      "<tr><td>High</td><td>" + (d.high) + "</td></tr>" +
      "</table>";
  }
}
